// External dependencies
import { FastifyRequest, FastifyReply } from 'fastify';
import { Injectable, NestMiddleware, Logger } from '@nestjs/common';

@Injectable()
export class RequestLogger implements NestMiddleware {
	private readonly logger = new Logger(RequestLogger.name);

	use(req: FastifyRequest['raw'], res: FastifyReply['raw'], next: () => void) {
		this.logger.log(`Incoming request! (Method: ${req.method} URL: ${req.url})`);

		res.on('finish', () => {
			this.logger.log(
				`Request finished ${
					res.statusCode >= 200 && res.statusCode < 300
						? 'successfully'
						: 'unsuccessfully'
				}! (Method:${req.method} URL: ${req.url} Status: ${res.statusCode} ${
					res.statusMessage
				})`
			);
		});

		next();
	}
}
