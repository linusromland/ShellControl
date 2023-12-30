import { Model, Table, Column, DataType } from 'sequelize-typescript';

@Table({
	tableName: 'log'
})
export class Log extends Model<Log> {
	@Column({
		type: DataType.STRING,
		allowNull: false
	})
	message: string;

	@Column({
		type: DataType.INTEGER,
		allowNull: false
	})
	sessionId: number;
}
