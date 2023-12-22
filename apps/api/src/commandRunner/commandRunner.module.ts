import { Module } from '@nestjs/common';
import { CommandRunnerController } from './commandRunner.controller';
import { CommandRunnerService } from './commandRunner.service';
import { ProjectModule } from 'src/project/project.module';

@Module({
	imports: [ProjectModule],
	controllers: [CommandRunnerController],
	providers: [CommandRunnerService]
})
export class CommandRunnerModule {}
