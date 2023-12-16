import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../../entities/project.entiity';

@Injectable()
export class ProjectsService {
	constructor(
		@InjectRepository(Project)
		private projectsRepository: Repository<Project>
	) {}

	findAll(): Promise<Project[]> {
		return this.projectsRepository.find();
	}

	findOne(id: number): Promise<Project> {
		return this.projectsRepository.findOne({
			where: {
				id: id
			}
		});
	}

	async create(shell: Omit<Project, 'id'>): Promise<Project> {
		return this.projectsRepository.save(shell);
	}
}
