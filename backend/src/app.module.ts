import { Module } from '@nestjs/common';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import * as entities from './database/entities';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { JobsModule } from './modules/jobs/jobs.module';
import { ApplicationsModule } from './modules/applications/applications.module';
import { ProfilesModule } from './modules/profiles/profiles.module';
import { InterviewsModule } from './modules/interviews/interviews.module';
import { BookmarksModule } from './modules/bookmarks/bookmarks.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { HealthModule } from './modules/health/health.module';
import { JwtAuthGuard, RolesGuard } from './common/guards/jwt-auth.guard';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig],
      envFilePath: ['.env', '../.env'],
    }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService): TypeOrmModuleOptions => {
        const entityList = Object.values(entities).filter(
          (e) => typeof e === 'function',
        );
        const dbType = config.get<string>('database.type') || 'sqlite';
        if (dbType === 'postgres') {
          return {
            type: 'postgres',
            host: config.get<string>('database.host'),
            port: config.get<number>('database.port'),
            username: config.get<string>('database.username'),
            password: config.get<string>('database.password'),
            database: config.get<string>('database.database'),
            entities: entityList,
            synchronize: config.get<boolean>('database.synchronize') ?? true,
            logging: config.get<boolean>('database.logging') ?? false,
          };
        }
        return {
          type: 'sqljs',
          autoSave: true,
          location: config.get<string>('database.sqlitePath') || 'data/uneedwhat.sqlite',
          entities: entityList,
          synchronize: config.get<boolean>('database.synchronize') ?? true,
          logging: config.get<boolean>('database.logging') ?? false,
        };
      },
    }),
    AuthModule,
    UsersModule,
    JobsModule,
    ApplicationsModule,
    ProfilesModule,
    InterviewsModule,
    BookmarksModule,
    AnalyticsModule,
    HealthModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
  ],
})
export class AppModule {}
