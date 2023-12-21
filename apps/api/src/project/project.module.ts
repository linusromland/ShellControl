import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Project } from '@local/shared/entities';

@Module({
	imports: [SequelizeModule.forFeature([Project])],
	controllers: [ProjectController],
	providers: [ProjectService]
})
export class ProjectModule {}
