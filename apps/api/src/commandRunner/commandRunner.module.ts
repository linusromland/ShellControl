import { Module } from '@nestjs/common';
import { CommandRunnerController } from './commandRunner.controller';
import { CommandRunnerService } from './commandRunner.service';
import { CommandRunnerGateway } from './commandRunner.gateway';
import { ProjectModule } from 'src/project/project.module';

@Module({
	imports: [ProjectModule],
	controllers: [CommandRunnerController],
	providers: [CommandRunnerService, CommandRunnerGateway]
})
export class CommandRunnerModule {}
