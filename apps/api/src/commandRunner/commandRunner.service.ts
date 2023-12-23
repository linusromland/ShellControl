import { Injectable, Logger } from '@nestjs/common';
import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import { CommandStatus } from '@local/shared/enums';
import { ProjectService } from '../project/project.service';
import {
	BadRequestException,
	InternalServerErrorException,
	NotFoundException,
	isHttpException
} from '../utils/getResponse';

@Injectable()
export class CommandRunnerService {
	constructor(private readonly projectService: ProjectService) {}

	private logger = new Logger('CommandRunnerService');
	private runningCommands: Map<number, ChildProcessWithoutNullStreams> = new Map();
	private logs: Map<number, string[]> = new Map();

	async runCommand(projectId: number) {
		try {
			const project = await this.projectService.findOne(projectId);

			if (!project) {
				this.logger.error('Project not found.');
				throw new NotFoundException('Project not found.');
			}

			const command = project.startCommand;
			const cwd = project.directory;

			if (this.runningCommands.has(projectId)) {
				this.logger.error('Command is already running for this project.');
				throw new BadRequestException('Command is already running for this project.');
			}

			const subprocess = spawn(command, [], { cwd, shell: true, stdio: 'pipe' });
			this.runningCommands.set(projectId, subprocess);

			const onData = (data: Buffer) => {
				const log = data.toString();
				const logs = this.logs.get(projectId) || [];
				logs.push(log);
				this.logs.set(projectId, logs);
			};

			subprocess.stdout.on('data', onData);
			subprocess.stderr.on('data', onData);

			subprocess.on('error', (error) => {
				this.logger.error(`Command error: ${error}`);
			});

			subprocess.on('exit', (code, signal) => {
				this.logger.log(`Command exited with code ${code}, signal ${signal}`);
			});

			subprocess.on('message', (message) => {
				this.logger.log(`Command message: ${message}`);
			});

			subprocess.on('disconnect', () => {
				this.logger.log('Command disconnected.');
			});

			subprocess.on('close', (code, signal) => {
				this.logger.log(`Command closed with code ${code}, signal ${signal}`);
			});

			subprocess.on('spawn', () => {
				this.logger.log(`Command "${command}" spawned.`);
			});
		} catch (error) {
			if (isHttpException(error)) {
				throw error;
			}

			throw new InternalServerErrorException(`Failed to run command: ${error.message}`);
		}
	}

	stopCommand(projectId: number) {
		try {
			const childProcess = this.runningCommands.get(projectId);

			if (!childProcess) {
				this.logger.error('Command not found for this project.');
				throw new NotFoundException('Command not found for this project.');
			}

			childProcess.kill();
			this.runningCommands.delete(projectId);

			return true;
		} catch (error) {
			if (isHttpException(error)) {
				throw error;
			}

			throw new InternalServerErrorException(`Failed to stop command: ${error.message}`);
		}
	}

	getCommandStatus(projectId: number): CommandStatus {
		if (this.runningCommands.has(projectId)) {
			this.logger.log('Command is running.');
			return CommandStatus.RUNNING;
		} else {
			this.logger.log('Command is stopped.');
			return CommandStatus.STOPPED;
		}
	}

	getCommandLogs(projectId: number): string[] {
		if (!this.logs.has(projectId)) {
			this.logger.log('No logs found for the command.');
			return [];
		}

		return this.logs.get(projectId);
	}
}
