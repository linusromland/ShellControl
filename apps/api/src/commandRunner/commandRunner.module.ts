import { Module } from '@nestjs/common';
import { CommandRunnerController } from './commandRunner.controller';
import { CommandRunnerService } from './commandRunner.service';
import { CommandRunnerGateway } from './commandRunner.gateway';
import { ProjectModule } from '../project/project.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { Log, Session } from '@local/shared/entities';

@Module({
	imports: [ProjectModule, SequelizeModule.forFeature([Session, Log])],
	controllers: [CommandRunnerController],
	providers: [CommandRunnerService, CommandRunnerGateway]
})
export class CommandRunnerModule {}
