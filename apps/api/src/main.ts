// External dependencies
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

// Internal dependencies
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

	const app: NestFastifyApplication = await NestFactory.create<NestFastifyApplication>(
		AppModule,
		new FastifyAdapter()
	);
	app.enableCors(CORS_OPTIONS);

	await app.listen(PORT);
}

bootstrap();
