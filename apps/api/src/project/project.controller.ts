import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ProjectService } from './project.service';
import { InternalServerErrorException, NotFoundException, getValidResponse } from '../utils/getResponse';
import { CreateProjectDto, UpdateProjectDto } from '@local/shared/dtos';
import { Project } from '@local/shared/entities';
import { Response } from '@local/shared/types';

@Controller('project')
export class ProjectController {
	constructor(private readonly projectService: ProjectService) {}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	async create(@Body() project: CreateProjectDto): Promise<Response<Project>> {
		try {
			const createdProject = await this.projectService.create(project);
			return getValidResponse<Project>('Project created successfully', createdProject);
		} catch (error) {
			throw new InternalServerErrorException('Project failed to create');
		}
	}

	@Get()
	@HttpCode(HttpStatus.OK)
	async findAll(): Promise<Response<Project[]>> {
		try {
			const projects = await this.projectService.findAll();
			return getValidResponse<Project[]>('Projects retrieved successfully', projects);
		} catch (error) {
			throw new InternalServerErrorException('Failed to retrieve projects');
		}
	}

	@Get(':id')
	@HttpCode(HttpStatus.OK)
	async findOne(@Param('id') id: string): Promise<Response<Project>> {
		try {
			const project = await this.projectService.findOne(+id);

			if (!project) {
				throw new NotFoundException('Project not found');
			}

			return getValidResponse<Project>('Project retrieved successfully', project);
		} catch (error) {
			throw new InternalServerErrorException('Failed to retrieve project');
		}
	}

	@Patch(':id')
	@HttpCode(HttpStatus.OK)
	async update(
		@Param('id') id: string,
		@Body() project: UpdateProjectDto
	): Promise<Response<[affectedCount: number]>> {
		try {
			const updated = await this.projectService.update(+id, project);

			if (!updated) {
				throw new InternalServerErrorException('Project failed to update');
			}

			return getValidResponse<[affectedCount: number]>('Project updated successfully', updated);
		} catch (error) {
			throw new InternalServerErrorException('Failed to update project');
		}
	}

	@Delete(':id')
	@HttpCode(HttpStatus.OK)
	async remove(@Param('id') id: string): Promise<Response<void>> {
		try {
			const deleted = await this.projectService.remove(+id);

			if (!deleted) {
				throw new InternalServerErrorException('Project failed to delete');
			}

			return getValidResponse('Project deleted successfully');
		} catch (error) {
			throw new InternalServerErrorException('Failed to delete project');
		}
	}
}
