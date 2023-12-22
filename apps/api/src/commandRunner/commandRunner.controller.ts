import { Controller, Param, Get, Post, Delete } from '@nestjs/common';
import { CommandRunnerService } from './commandRunner.service';

@Controller('commandRunner')
export class CommandRunnerController {
	constructor(private readonly commandRunnerService: CommandRunnerService) {}

	@Post('run/:projectId')
	runCommand(@Param('projectId') projectId: number): string {
		this.commandRunnerService.runCommand(projectId);

		return 'Command started successfully';
	}

	@Delete('stop/:projectId')
	stopCommand(@Param('projectId') projectId: number): string {
		this.commandRunnerService.stopCommand(projectId);

		return 'Command stopped successfully';
	}

	@Get('status/:projectId')
	getCommandStatus(@Param('projectId') projectId: number): string {
		return this.commandRunnerService.getCommandStatus(projectId);
	}

	@Get('logs/:projectId')
	getCommandLogs(@Param('projectId') projectId: number): string[] {
		return this.commandRunnerService.getCommandLogs(projectId);
	}
}
