import { Controller, Get, Query } from '@nestjs/common';
import { ShellService } from './shell.service';

@Controller('shell')
export class ShellController {
	constructor(private readonly shellService: ShellService) {}

	@Get('/execute')
	async executeCommand(@Query('cmd') cmd: string): Promise<string> {
		try {
			const output = await this.shellService.runCommand(cmd);
			return output;
		} catch (error) {
			return `Error executing command: ${error}`;
		}
	}
}
