// External dependencies
import {
  MiddlewareConsumer, Module, NestModule, ValidationPipe,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

// Internal dependencies
import { RequestLogger } from './middlewares/requestLogger.middleware';
import { HealthModule } from './routes/health/health.module';
import { ProjectsModule } from './routes/projects/projects.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [`${__dirname}/entities/*.entity{.ts,.js}`],
      synchronize: true,
    }),
    HealthModule,
    ProjectsModule,
  ],
  providers: [
    {
      provide: 'APP_PIPE',
      useValue: new ValidationPipe({
        transform: true,
        whitelist: true,
        stopAtFirstError: true,
      }),
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestLogger).forRoutes('*');
  }
}
