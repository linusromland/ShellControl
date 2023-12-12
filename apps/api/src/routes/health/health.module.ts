// External dependencies
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';

// Internal dependencies
import HealthService from './health.service';
import HealthController from './health.controller';

@Module({
	imports: [ConfigModule.forRoot(), TerminusModule],
	controllers: [HealthController],
	providers: [HealthService],
	exports: []
})
export class HealthModule {}
