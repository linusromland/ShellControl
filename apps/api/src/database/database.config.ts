import { SequelizeModuleOptions } from '@nestjs/sequelize';
import { Logger } from '@nestjs/common';

const logger = new Logger('Sequelize');

export const databaseConfig: SequelizeModuleOptions = {
	dialect: 'sqlite',
	storage: '.db/data.sqlite3',
	autoLoadModels: true,
	synchronize: true,
	logging: (msg) => logger.log(msg)
};
