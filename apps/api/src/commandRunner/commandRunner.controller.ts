import { Controller, Param, Get, Post, Delete } from '@nestjs/common';
import { CommandRunnerService } from './commandRunner.service';
import { Response } from '@local/shared/types';
import { CommandStatus } from '@local/shared/enums';

@Controller('commandRunner')
export class CommandRunnerController {
	constructor(private readonly commandRunnerService: CommandRunnerService) {}

	@Post('run/:projectId')
	async runCommand(@Param('projectId') projectId: number): Promise<Response> {
		const success = await this.commandRunnerService.runCommand(projectId);

		return {
			success,
			message: success ? 'Command started successfully' : 'Command failed to start',
			data: null
		};
	}

	@Delete('stop/:projectId')
	stopCommand(@Param('projectId') projectId: number): Response {
		const success = this.commandRunnerService.stopCommand(projectId);

		return {
			success,
			message: success ? 'Command stopped successfully' : 'Command failed to stop',
			data: null
		};
	}

	@Get('status/:projectId')
	getCommandStatus(@Param('projectId') projectId: number): Response<CommandStatus> {
		const commandStatus = this.commandRunnerService.getCommandStatus(projectId);

		return {
			success: true,
			message: 'Command status retrieved successfully',
			data: commandStatus
		};
	}

	@Get('logs/:projectId')
	getCommandLogs(@Param('projectId') projectId: number): Response<string[]> {
		const logs = this.commandRunnerService.getCommandLogs(projectId);

		return {
			success: true,
			message: 'Command logs retrieved successfully',
			data: logs
		};
	}
}
