import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { INestApplication } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { AppModule } from './app.module';

const PORT = process.env.PORT ? Number(process.env.PORT) : 63000;

async function bootstrap() {
	const CORS_OPTIONS = {
		origin: '*',
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
	app.useWebSocketAdapter(new IoAdapter(app));

	await app.listen(PORT);
}

bootstrap();
