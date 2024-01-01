import { Model, Table, Column, DataType, HasMany } from 'sequelize-typescript';
import { Log } from './log.entity';
import { CommandStatus } from '../enums';

@Table({
	tableName: 'session'
})
export class Session extends Model<Session> {
	@Column({
		type: DataType.INTEGER,
		allowNull: false
	})
	projectId: number;

	@Column({
		type: DataType.STRING,
		allowNull: false
	})
	status: CommandStatus;

	@HasMany(() => Log, { foreignKey: 'sessionId' })
	logs: Log[];
}
