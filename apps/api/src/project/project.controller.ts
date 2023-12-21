import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProjectService } from './project.service';
import { Project } from '@local/shared/entities';

@Controller('project')
export class ProjectController {
	constructor(private readonly projectService: ProjectService) {}

	@Post()
	create(@Body() project: Project) {
		return this.projectService.create(project);
	}

	@Get()
	findAll() {
		return this.projectService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.projectService.findOne(+id);
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() project: Partial<Project>) {
		return this.projectService.update(+id, project);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.projectService.remove(+id);
	}
}
