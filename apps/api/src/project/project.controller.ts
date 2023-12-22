import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto, UpdateProjectDto } from '@local/shared/dtos';

@Controller('project')
export class ProjectController {
	constructor(private readonly projectService: ProjectService) {}

	@Post()
	create(@Body() project: CreateProjectDto) {
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
	update(@Param('id') id: string, @Body() project: UpdateProjectDto) {
		return this.projectService.update(+id, project);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.projectService.remove(+id);
	}
}
