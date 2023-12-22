import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	NotFoundException,
	InternalServerErrorException
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto, UpdateProjectDto } from '@local/shared/dtos';

@Controller('project')
export class ProjectController {
	constructor(private readonly projectService: ProjectService) {}

	@Post()
	async create(@Body() project: CreateProjectDto) {
		const createdProject = this.projectService.create(project);

		if (!createdProject) {
			return {
				success: false,
				message: 'Project failed to create',
				data: null
			};
		}

		return {
			success: true,
			message: 'Project created successfully',
			data: createdProject
		};
	}

	@Get()
	async findAll() {
		const projects = await this.projectService.findAll();

		return {
			success: true,
			message: 'Projects retrieved successfully',
			data: projects
		};
	}

	@Get(':id')
	async findOne(@Param('id') id: string) {
		const project = await this.projectService.findOne(+id);

		if (!project) {
			throw new NotFoundException({
				success: false,
				message: 'Project not found',
				data: null
			});
		}

		return {
			success: true,
			message: 'Project retrieved successfully',
			data: project
		};
	}

	@Patch(':id')
	async update(@Param('id') id: string, @Body() project: UpdateProjectDto) {
		const updated = await this.projectService.update(+id, project);

		if (!updated) {
			throw new InternalServerErrorException({
				success: false,
				message: 'Project failed to update',
				data: null
			});
		}

		return {
			success: true,
			message: 'Project updated successfully',
			data: updated
		};
	}

	@Delete(':id')
	async remove(@Param('id') id: string) {
		const deleted = await this.projectService.remove(+id);

		if (!deleted) {
			throw new InternalServerErrorException({
				success: false,
				message: 'Project failed to delete',
				data: null
			});
		}

		return {
			success: true,
			message: 'Project deleted successfully',
			data: null
		};
	}
}
