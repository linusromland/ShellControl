import { Model, Table, Column, DataType } from 'sequelize-typescript';

@Table({
	tableName: 'project'
})
export class Project extends Model<Project> {
	@Column({
		type: DataType.STRING,
		allowNull: false
	})
	name: string;

	@Column({
		type: DataType.STRING,
		allowNull: true
	})
	description: string;

	@Column({
		type: DataType.STRING,
		allowNull: false
	})
	directory: string;

	@Column({
		type: DataType.STRING,
		allowNull: false
	})
	startCommand: string;

	@Column({
		type: DataType.BOOLEAN,
		allowNull: false
	})
	autoStart: boolean;
}
