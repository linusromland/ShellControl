import { Controller, Get } from '@nestjs/common';
import { HealthCheckResult } from '@nestjs/terminus';
import HealthService from './health.service';

@Controller('health')
export default class HealthController {
	constructor(private healthService: HealthService) {}

	@Get()
	public async check(): Promise<HealthCheckResult> {
		return this.healthService.check();
	}
}
