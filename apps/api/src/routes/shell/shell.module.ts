// External dependencies
import { Module } from '@nestjs/common';

// Internal dependencies
import { ShellController } from './shell.controller';
import { ShellService } from './shell.service';

@Module({
	providers: [ShellService],
	controllers: [ShellController]
})
export class ShellModule {}
