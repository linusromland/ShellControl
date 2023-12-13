import { Controller, Get, Query } from '@nestjs/common';
import { ShellService } from './shell.service';

@Controller('shell')
export class ShellController {
	constructor(private readonly shellService: ShellService) {}

	@Get()
	findAll(): Promise<any[]> {
		return this.shellService.findAll();
	}

	@Get('find')
	findOne(@Query('id') id: number): Promise<any> {
		return this.shellService.findOne(id);
	}

	@Get('create')
	async create(
		@Query('name') name: string,
		@Query('directory') directory: string,
		@Query('command') command: string
	): Promise<any> {
		return this.shellService.create({
			name: name,
			directory: directory,
			command: command
		});
	}
}
