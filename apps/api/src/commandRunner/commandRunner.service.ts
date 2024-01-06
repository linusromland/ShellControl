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
import killProcess from 'src/utils/killProcess';

type setSessionStatusByProjectId = { projectId: number };
type setSessionStatusBySessionId = { sessionId: number };

@Injectable()
export class CommandRunnerService {
	constructor(
		private readonly projectService: ProjectService,
		private readonly commandRunnerGateway: CommandRunnerGateway,

		@InjectModel(Session)
		private sessionModel: typeof Session,

		@InjectModel(Log)
		private logModel: typeof Log
	) {
		this.verifyRunningSessions();
		setInterval(() => this.verifyRunningSessions(), 30 * 1000); // 30 seconds
	}

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

			const sessions = await this.sessionModel.findAll({ where: { projectId, status: CommandStatus.RUNNING } });

			if (sessions.length > 0) {
				this.logger.log(`Stopping ${sessions.length} running sessions for project ${projectId}`);

				for (const session of sessions) {
					this.logger.log(`Stopping session ${session.id}`);
					this.setSessionStatus({ sessionId: session.id }, CommandStatus.STOPPED);
				}
			}

			const updateTime = new Date();

			const session = await this.sessionModel.create({
				projectId,
				status: CommandStatus.RUNNING,
				createdAt: new Date(),
				updatedAt: new Date()
			});

			const subprocess = spawn(command, [], { cwd, shell: true, stdio: 'pipe' });
			this.logger.log(`Command started with PID ${subprocess.pid}`);
			this.runningCommands.set(projectId, subprocess);
			this.commandRunnerGateway.broadcastToRoom('status', projectId.toString(), {
				status: CommandStatus.RUNNING,
				updateTime: updateTime
			});

			const onData = async (data: Buffer) => {
				const log = await this.logModel.create({
					message: data.toString(),
					sessionId: session.id,
					createdAt: new Date(),
					updatedAt: new Date()
				});

				this.commandRunnerGateway.broadcastToRoom(session.id?.toString(), 'log', log);
			};

			subprocess.stdout.on('data', onData);
			subprocess.stderr.on('data', onData);

			subprocess.on('error', (error) => {
				this.logger.error(`Command error: ${error}`);
			});

			subprocess.on('exit', async (code, signal) => {
				if (!code) {
					this.logger.log(`Command exited with signal ${signal}`);

					this.setSessionStatus({ sessionId: session.id }, CommandStatus.STOPPED);

					return;
				}

				this.logger.log(`Command exited with code ${code}`);

				const status = code === 0 ? CommandStatus.STOPPED : CommandStatus.CRASHED;

				this.setSessionStatus({ sessionId: session.id }, status);
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

			// Overwrite the exit listener to prevent the session from being marked as crashed
			childProcess.removeAllListeners('exit');

			if (await killProcess(childProcess.pid)) {
				this.setSessionStatus({ projectId }, CommandStatus.STOPPED);
				this.runningCommands.delete(projectId);

				return true;
			} else {
				return false;
			}
		} catch (error) {
			if (isHttpException(error)) {
				throw error;
			}

			throw new InternalServerErrorException(`Failed to stop command: ${error.message}`);
		}
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

			if (!session) new NotFoundException('Session not found.');

			return session.status;
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

	private isProjectId(
		idObject: setSessionStatusByProjectId | setSessionStatusBySessionId
	): idObject is setSessionStatusByProjectId {
		return (idObject as setSessionStatusByProjectId).projectId !== undefined;
	}

	private async setSessionStatus(
		idObject: setSessionStatusByProjectId | setSessionStatusBySessionId,

		status: CommandStatus
	) {
		const whereQuery = this.isProjectId(idObject) ? { projectId: idObject.projectId } : { id: idObject.sessionId };

		// Find the latest session for this project
		const latestSession = await this.sessionModel.findOne({
			where: whereQuery,
			order: [['createdAt', 'DESC']]
		});

		if (!latestSession) {
			this.logger.error('Session not found.');
			throw new NotFoundException('Session not found.');
		}

		const updateTime = new Date();

		await this.sessionModel.update(
			{ status, updatedAt: updateTime },
			{
				where: { id: latestSession.id }
			}
		);

		this.commandRunnerGateway.broadcastToRoom('status', latestSession.projectId.toString(), {
			status: status,
			updateTime: updateTime
		});
	}

	private async verifyRunningSessions() {
		this.logger.log('Verifying running sessions');

		const sessions = await this.sessionModel.findAll({ where: { status: CommandStatus.RUNNING } });

		for (const session of sessions) {
			const childProcess = this.runningCommands.get(session.projectId);

			if (!childProcess) {
				this.logger.log(`Session ${session.id} is running but no child process found. Stopping session.`);
				this.setSessionStatus(
					{
						sessionId: session.id
					},
					CommandStatus.STOPPED
				);
			}
		}
	}
}
