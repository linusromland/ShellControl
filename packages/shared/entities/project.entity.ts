import { Model, Table, Column, DataType, HasMany } from 'sequelize-typescript';
import { Session } from './session.entity';
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

	@HasMany(() => Session, { foreignKey: 'projectId' })
	sessions: Session[];
}
