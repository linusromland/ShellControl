import { Injectable, Logger } from '@nestjs/common';
import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import { CommandStatus } from '@local/shared/enums';
import { ProjectService } from '../project/project.service';
import { CommandRunnerGateway } from './commandRunner.gateway';
import {
	BadRequestException,
	InternalServerErrorException,
	NotFoundException,
	isHttpException
} from '../utils/getResponse';
import { InjectModel } from '@nestjs/sequelize';
import { Log, Session } from '@local/shared/entities';

@Injectable()
export class CommandRunnerService {
	constructor(
		private readonly projectService: ProjectService,
		private readonly commandRunnerGateway: CommandRunnerGateway,

		@InjectModel(Session)
		private sessionModel: typeof Session,

		@InjectModel(Log)
		private logModel: typeof Log
	) {}

	private logger = new Logger('CommandRunnerService');
	private runningCommands: Map<number, ChildProcessWithoutNullStreams> = new Map();

	async startCommand(projectId: number) {
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

			const sessions = await this.sessionModel.findAll({ where: { projectId, stopReason: '' } });

			if (sessions.length > 0) {
				this.logger.log(`Stopping ${sessions.length} running sessions for project ${projectId}`);

				for (const session of sessions) {
					this.logger.log(`Stopping session ${session.id}`);
					this.removeStoppedCommand(projectId, '0');
				}
			}

			const session = await this.sessionModel.create({
				projectId,
				stopReason: '',
				createdAt: new Date(),
				updatedAt: new Date()
			});

			const subprocess = spawn(command, [], { cwd, shell: true, stdio: 'pipe' });
			this.runningCommands.set(projectId, subprocess);
			this.commandRunnerGateway.broadcastToRoom('status', projectId.toString(), CommandStatus.RUNNING);

			const onData = async (data: Buffer) => {
				const log = await this.logModel.create({
					message: data.toString(),
					sessionId: session.id,
					createdAt: new Date(),
					updatedAt: new Date()
				});

				this.commandRunnerGateway.broadcastToRoom(`${projectId}`, 'log', log);
			};

			subprocess.stdout.on('data', onData);
			subprocess.stderr.on('data', onData);

			subprocess.on('error', (error) => {
				this.logger.error(`Command error: ${error}`);
			});

			subprocess.on('exit', async (code, signal) => {
				this.logger.log(`Command exited with code ${code}, signal ${signal}`);

				const stopReason = code === 0 ? CommandStatus.STOPPED : CommandStatus.CRASHED;

				this.commandRunnerGateway.broadcastToRoom('status', projectId.toString(), stopReason);
				this.removeStoppedCommand(projectId, stopReason);
			});
		} catch (error) {
			if (isHttpException(error)) {
				throw error;
			}

			throw new InternalServerErrorException(`Failed to run command: ${error.message}`);
		}
	}

	async stopCommand(projectId: number) {
		try {
			const childProcess = this.runningCommands.get(projectId);

			if (!childProcess) {
				this.logger.error('Command not found for this project.');
				throw new NotFoundException('Command not found for this project.');
			}

			childProcess.kill();
			this.removeStoppedCommand(projectId, '0');

			return true;
		} catch (error) {
			if (isHttpException(error)) {
				throw error;
			}

			throw new InternalServerErrorException(`Failed to stop command: ${error.message}`);
		}
	}

	private removeStoppedCommand(projectId: number, stopReason: string) {
		this.runningCommands.delete(projectId);
		this.sessionModel.update({ stopReason, updatedAt: new Date() }, { where: { projectId, stopReason: '' } });
	}

	async getCommandStatus(projectId: number): Promise<CommandStatus> {
		try {
			const childProcess = this.runningCommands.get(projectId);

			if (childProcess) {
				return CommandStatus.RUNNING;
			}

			const session = await this.sessionModel.findOne({
				where: { projectId },
				order: [['createdAt', 'DESC']]
			});

			if (!session) {
				return CommandStatus.STOPPED;
			}

			return session.stopReason as CommandStatus;
		} catch (error) {
			if (isHttpException(error)) {
				throw error;
			}

			throw new InternalServerErrorException(`Failed to get command status: ${error.message}`);
		}
	}

	async getSessions(projectId: number) {
		try {
			const sessions = await this.sessionModel.findAll({ where: { projectId } });

			return sessions;
		} catch (error) {
			if (isHttpException(error)) {
				throw error;
			}

			throw new InternalServerErrorException(`Failed to get sessions: ${error.message}`);
		}
	}

	async getSessionLogs(sessionId: number) {
		try {
			const logs = await this.logModel.findAll({ where: { sessionId } });

			return logs;
		} catch (error) {
			if (isHttpException(error)) {
				throw error;
			}

			throw new InternalServerErrorException(`Failed to get session logs: ${error.message}`);
		}
	}
}
