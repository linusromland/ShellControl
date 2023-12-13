import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shell } from '../../entities/shell.entiity';

@Injectable()
export class ShellService {
	constructor(
		@InjectRepository(Shell)
		private usersRepository: Repository<Shell>
	) {}

	findAll(): Promise<Shell[]> {
		return this.usersRepository.find();
	}

	findOne(id: number): Promise<Shell> {
		return this.usersRepository.findOne({
			where: {
				id: id
			}
		});
	}

	async create(shell: Omit<Shell, 'id'>): Promise<Shell> {
		return this.usersRepository.save(shell);
	}
}
