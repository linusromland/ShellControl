import { Controller, Param, Get, Post, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { CommandRunnerService } from './commandRunner.service';
import { Response } from '@local/shared/types';
import { CommandStatus } from '@local/shared/enums';
import { InternalServerErrorException, getValidResponse } from '../utils/getResponse';

@Controller('commandRunner')
export class CommandRunnerController {
	constructor(private readonly commandRunnerService: CommandRunnerService) {}

	@Post('run/:projectId')
	@HttpCode(HttpStatus.OK)
	async runCommand(@Param('projectId') projectId: number): Promise<Response<void>> {
		try {
			await this.commandRunnerService.runCommand(projectId);
			return getValidResponse('Command started successfully');
		} catch (error) {
			throw new InternalServerErrorException('Failed to start command');
		}
	}

	@Delete('stop/:projectId')
	@HttpCode(HttpStatus.OK)
	stopCommand(@Param('projectId') projectId: number): Response<void> {
		try {
			this.commandRunnerService.stopCommand(projectId);
			return getValidResponse('Command stopped successfully');
		} catch (error) {
			throw new InternalServerErrorException('Failed to stop command');
		}
	}

	@Get('status/:projectId')
	@HttpCode(HttpStatus.OK)
	getCommandStatus(@Param('projectId') projectId: number): Response<CommandStatus> {
		try {
			const commandStatus = this.commandRunnerService.getCommandStatus(projectId);
			return getValidResponse<CommandStatus>('Command status retrieved successfully', commandStatus);
		} catch (error) {
			throw new InternalServerErrorException('Failed to retrieve command status');
		}
	}

	@Get('logs/:projectId')
	@HttpCode(HttpStatus.OK)
	getCommandLogs(@Param('projectId') projectId: number): Response<string[]> {
		try {
			const logs = this.commandRunnerService.getCommandLogs(projectId);
			return getValidResponse<string[]>('Command logs retrieved successfully', logs);
		} catch (error) {
			throw new InternalServerErrorException('Failed to retrieve command logs');
		}
	}
}
