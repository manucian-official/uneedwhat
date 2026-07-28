import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
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
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { AdminModule } from './modules/admin/admin.module';
import { CommonModule } from './common/common.module';
import { JwtAuthGuard, RolesGuard } from './common/guards/jwt-auth.guard';
import { PlanLimitGuard } from './common/guards/plan-limit.guard';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { IpFirewallMiddleware } from './common/middleware/ip-firewall.middleware';
import { SeedService } from './database/seed.service';
import { SubscriptionPlan } from './database/entities/subscription-plan.entity';
import { User } from './database/entities/user.entity';
import { Subscription } from './database/entities/subscription.entity';
import { OrganizationMember } from './database/entities/organization-member.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig],
      envFilePath: ['.env', '../.env'],
    }),
    ThrottlerModule.forRoot([
      { name: 'default', ttl: 60000, limit: 100 },
      { name: 'auth', ttl: 60000, limit: 10 },
    ]),
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
    TypeOrmModule.forFeature([
      SubscriptionPlan,
      User,
      Subscription,
      OrganizationMember,
    ]),
    CommonModule,
    AuthModule,
    UsersModule,
    JobsModule,
    ApplicationsModule,
    ProfilesModule,
    InterviewsModule,
    BookmarksModule,
    AnalyticsModule,
    HealthModule,
    SubscriptionsModule,
    OrganizationsModule,
    AdminModule,
  ],
  providers: [
    SeedService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: PlanLimitGuard },
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(IpFirewallMiddleware).forRoutes('*');
  }
}
