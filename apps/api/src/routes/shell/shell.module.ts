import { Module } from '@nestjs/common';
import { ShellService } from './shell.service';
import { ShellController } from './shell.controller';

@Module({
	providers: [ShellService],
	controllers: [ShellController]
})
export class ShellModule {}
