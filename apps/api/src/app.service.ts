import { Injectable } from '@nestjs/common';
import { HelloWorld } from '../../../packages/shared';

@Injectable()
export class AppService {
	getHello(): HelloWorld {
		return { hello: 'Hello World!' };
	}
}
