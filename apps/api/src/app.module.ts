// External dependencies
import { MiddlewareConsumer, Module, NestModule, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

// Internal dependencies
import { RequestLogger } from './middlewares/requestLogger.middleware';
import { HealthModule } from './routes/health/health.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true
		}),
		HealthModule
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
