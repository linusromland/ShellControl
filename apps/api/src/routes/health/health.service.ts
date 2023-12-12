// External dependencies
import { Injectable } from '@nestjs/common';
import {
	HealthCheckService,
	HealthCheck,
	MemoryHealthIndicator,
	HealthCheckResult
} from '@nestjs/terminus';

@Injectable()
export default class HealthService {
	constructor(private health: HealthCheckService, private memory: MemoryHealthIndicator) {}

	@HealthCheck()
	check(): Promise<HealthCheckResult> {
		const memLimit: number = 150 * 1024 * 1024; // 150MB

		return this.health.check([
			() => this.memory.checkHeap('memory_heap', memLimit),
			() => this.memory.checkRSS('memory_rss', memLimit)
		]);
	}
}
