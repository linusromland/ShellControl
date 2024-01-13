import { Controller, Param, Get, Post, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { CommandRunnerService } from './commandRunner.service';
import { Response } from '@local/shared/types';
import { CommandStatus } from '@local/shared/enums';
import { InternalServerErrorException, getValidResponse, isHttpException } from '../utils/getResponse';
import { Log, Session } from '@local/shared/entities';

@Controller('commandRunner')
export class CommandRunnerController {
	constructor(private readonly commandRunnerService: CommandRunnerService) {}

	@Post('start/:projectId')
	@HttpCode(HttpStatus.OK)
	async startCommand(@Param('projectId') projectId: number): Promise<Response<void>> {
		try {
			await this.commandRunnerService.startCommand(projectId);
			return getValidResponse('Command started successfully');
		} catch (error) {
			throw new InternalServerErrorException('Failed to start command');
		}
	}

	@Delete('stop/:projectId')
	@HttpCode(HttpStatus.OK)
	async stopCommand(@Param('projectId') projectId: number): Promise<Response<void>> {
		try {
			await this.commandRunnerService.stopCommand(projectId);
			return getValidResponse('Command stopped successfully');
		} catch (error) {
			throw new InternalServerErrorException('Failed to stop command');
		}
	}

	@Get('status/:projectId')
	@HttpCode(HttpStatus.OK)
	async getCommandStatus(@Param('projectId') projectId: number): Promise<Response<CommandStatus>> {
		try {
			const commandStatus = await this.commandRunnerService.getCommandStatus(projectId);
			return getValidResponse<CommandStatus>('Command status retrieved successfully', commandStatus);
		} catch (error) {
			if (isHttpException(error)) {
				throw error;
			}

			throw new InternalServerErrorException('Something went wrong');
		}
	}

	@Get('sessions/:projectId')
	@HttpCode(HttpStatus.OK)
	async getSessions(@Param('projectId') projectId: number): Promise<Response<Session[]>> {
		try {
			const sessions = await this.commandRunnerService.getSessions(projectId);
			return getValidResponse('Sessions retrieved successfully', sessions);
		} catch (error) {
			throw new InternalServerErrorException('Failed to retrieve sessions');
		}
	}

	@Get('logs/:sessionId')
	@HttpCode(HttpStatus.OK)
	async getSessionLogs(@Param('sessionId') sessionId: number): Promise<Response<Log[]>> {
		try {
			const logs = await this.commandRunnerService.getSessionLogs(sessionId);
			return getValidResponse('Logs retrieved successfully', logs);
		} catch (error) {
			throw new InternalServerErrorException('Failed to retrieve logs');
		}
	}
}
