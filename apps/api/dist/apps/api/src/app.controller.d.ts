import { AppService } from './app.service';
import { HelloWorld } from '../../../packages/shared';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getHello(): HelloWorld;
}
