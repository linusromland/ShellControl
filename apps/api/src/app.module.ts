import { MiddlewareConsumer, Module, NestModule, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { RequestLogger } from './middlewares/requestLogger.middleware';
import { HealthModule } from './health/health.module';
import { databaseConfig } from './database/database.config';
import { ProjectModule } from './project/project.module';
import { CommandRunnerModule } from './commandRunner/commandRunner.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true
		}),
		SequelizeModule.forRoot(databaseConfig),
		HealthModule,
		ProjectModule,
		CommandRunnerModule
	],
	providers: [
		{
			provide: 'APP_PIPE',
			useValue: new ValidationPipe({
				transform: true,
				whitelist: true,
				stopAtFirstError: true
			})
		}
	]
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer): void {
		consumer.apply(RequestLogger).forRoutes('*');
	}
}
