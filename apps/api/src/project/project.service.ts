import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Project } from '@local/shared/entities';
import { CreateProjectDto, UpdateProjectDto } from '@local/shared/dtos';

@Injectable()
export class ProjectService {
	constructor(
		@InjectModel(Project)
		private projectModel: typeof Project
	) {}

	create(createProject: CreateProjectDto) {
		return this.projectModel.create({
			...createProject,
			createdAt: new Date(),
			updatedAt: new Date()
		});
	}

	findAll() {
		return this.projectModel.findAll();
	}

	findOne(id: number) {
		return this.projectModel.findByPk(id);
	}

	update(id: number, updateProject: UpdateProjectDto) {
		return this.projectModel.update(
			{
				...updateProject,
				updatedAt: new Date()
			},
			{
				where: {
					id
				}
			}
		);
	}

	remove(id: number) {
		return this.projectModel.destroy({
			where: {
				id
			}
		});
	}
}
