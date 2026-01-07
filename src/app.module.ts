import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import * as Joi from 'joi';

import { CommonModule } from './common/common.module';
import { BearerTokenMiddleware } from './common/middleware/bearer-token.middleware';
import { AuthGuard } from './common/guard/auth.guard';
import { RBACGuard } from './common/guard/rbac.guard';
import { ForbiddenExceptionFilter } from './common/filter/forbidden.filter';
import { QueryFailedExceptionFilter } from './common/filter/query-failed.filter';
import { envVariableKeys } from './common/const/env.const';

// Feature Modules
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { ChatModule } from './chat/chat.module';
import { NotificationModule } from './notification/notification.module';
import { ReviewModule } from './review/review.module';
import { S3Module } from './s3/s3.module';
import { FcmModule } from './fcm/fcm.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        ENV: Joi.string().valid('prod', 'dev').required(),
        DB_TYPE: Joi.string().valid('postgres').required(),
        DB_URL: Joi.string().required(),
        HASH_ROUNDS: Joi.number().required(),
        ACCESS_TOKEN_SECRET: Joi.string().required(),
        REFRESH_TOKEN_SECRET: Joi.string().required(),
        KAKAO_CLIENT_ID: Joi.string().optional(),
        KAKAO_CLIENT_SECRET: Joi.string().optional(),
        NAVER_CLIENT_ID: Joi.string().optional(),
        NAVER_CLIENT_SECRET: Joi.string().optional(),
        GOOGLE_CLIENT_ID: Joi.string().optional(),
        GOOGLE_CLIENT_SECRET: Joi.string().optional(),
        AWS_ACCESS_KEY_ID: Joi.string().optional(),
        AWS_SECRET_ACCESS_KEY: Joi.string().optional(),
        AWS_REGION: Joi.string().optional(),
        S3_PUBLIC_BUCKET: Joi.string().optional(),
        S3_PRIVATE_BUCKET: Joi.string().optional(),
        FCM_PROJECT_ID: Joi.string().optional(),
        FCM_SERVICE_ACCOUNT_PATH: Joi.string().optional(),
        REDIS_HOST: Joi.string().optional(),
        REDIS_PORT: Joi.number().optional(),
      }),
    }),

    // Database
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: configService.getOrThrow<string>(
          envVariableKeys.dbType,
        ) as 'postgres',
        url: configService.getOrThrow<string>(envVariableKeys.dbUrl),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize:
          configService.getOrThrow<string>(envVariableKeys.env) !== 'prod',
        logging:
          configService.getOrThrow<string>(envVariableKeys.env) !== 'prod',
      }),
      inject: [ConfigService],
    }),

    // Rate Limiting
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 60 seconds
        limit: 100, // 100 requests per 60 seconds
      },
    ]),

    // Common Module
    CommonModule,

    // Feature Modules
    AuthModule,
    UserModule,
    ProductModule,
    ChatModule,
    NotificationModule,
    ReviewModule,
    S3Module,
    FcmModule,
    HealthModule,
  ],
  controllers: [],
  providers: [
    // Global Guards
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RBACGuard,
    },

    // Global Filters
    {
      provide: APP_FILTER,
      useClass: ForbiddenExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: QueryFailedExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(BearerTokenMiddleware)
      .exclude(
        { path: 'auth/register', method: RequestMethod.POST },
        { path: 'auth/login', method: RequestMethod.POST },
        { path: 'auth/social', method: RequestMethod.POST },
      )
      .forRoutes('*');
  }
}
