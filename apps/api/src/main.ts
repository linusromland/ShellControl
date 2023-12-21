import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { INestApplication } from '@nestjs/common';
import { AppModule } from './app.module';

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

async function bootstrap() {
	const CORS_OPTIONS = {
		origin: [process.env.CLIENT_HOST || 'none'],
		allowedHeaders: [
			'Access-Control-Allow-Origin',
			'Origin',
			'X-Requested-With',
			'Accept',
			'Content-Type',
			'Authorization'
		],
		methods: ['GET', 'PUT', 'OPTIONS', 'POST', 'PATCH', 'DELETE']
	};

	const app: INestApplication = await NestFactory.create(AppModule, new ExpressAdapter());
	app.enableCors(CORS_OPTIONS);

	await app.listen(PORT);
}

bootstrap();
