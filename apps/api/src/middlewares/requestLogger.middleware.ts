// External dependencies
import { Request, Response } from 'express';
import { Injectable, NestMiddleware, Logger } from '@nestjs/common';

@Injectable()
export class RequestLogger implements NestMiddleware {
  private readonly logger = new Logger(RequestLogger.name);

  use(req: Request, res: Response, next: () => void) {
    this.logger.log(`Incoming request! (Method: ${req.method} URL: ${req.originalUrl})`);

    res.on('finish', () => {
      this.logger.log(
        `Request finished ${
          res.statusCode >= 200 && res.statusCode < 300
            ? 'successfully'
            : 'unsuccessfully'
        }! (Method:${req.method} URL: ${req.originalUrl} Status: ${res.statusCode} ${
          res.statusMessage
        })`,
      );
    });

    next();
  }
}
