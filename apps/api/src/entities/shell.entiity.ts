// External dependencies
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Shell {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column()
	directory: string;

	@Column()
	command: string;
}
