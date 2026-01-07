"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const throttler_1 = require("@nestjs/throttler");
const core_1 = require("@nestjs/core");
const Joi = __importStar(require("joi"));
const common_module_1 = require("./common/common.module");
const bearer_token_middleware_1 = require("./common/middleware/bearer-token.middleware");
const auth_guard_1 = require("./common/guard/auth.guard");
const rbac_guard_1 = require("./common/guard/rbac.guard");
const forbidden_filter_1 = require("./common/filter/forbidden.filter");
const query_failed_filter_1 = require("./common/filter/query-failed.filter");
const env_const_1 = require("./common/const/env.const");
const auth_module_1 = require("./auth/auth.module");
const user_module_1 = require("./user/user.module");
const product_module_1 = require("./product/product.module");
const chat_module_1 = require("./chat/chat.module");
const notification_module_1 = require("./notification/notification.module");
const review_module_1 = require("./review/review.module");
const s3_module_1 = require("./s3/s3.module");
const fcm_module_1 = require("./fcm/fcm.module");
const health_module_1 = require("./health/health.module");
let AppModule = class AppModule {
    configure(consumer) {
        consumer
            .apply(bearer_token_middleware_1.BearerTokenMiddleware)
            .exclude({ path: 'auth/register', method: common_1.RequestMethod.POST }, { path: 'auth/login', method: common_1.RequestMethod.POST }, { path: 'auth/social', method: common_1.RequestMethod.POST })
            .forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
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
            typeorm_1.TypeOrmModule.forRootAsync({
                useFactory: (configService) => ({
                    type: configService.getOrThrow(env_const_1.envVariableKeys.dbType),
                    url: configService.getOrThrow(env_const_1.envVariableKeys.dbUrl),
                    entities: [__dirname + '/**/*.entity{.ts,.js}'],
                    synchronize: configService.getOrThrow(env_const_1.envVariableKeys.env) !== 'prod',
                    logging: configService.getOrThrow(env_const_1.envVariableKeys.env) !== 'prod',
                }),
                inject: [config_1.ConfigService],
            }),
            throttler_1.ThrottlerModule.forRoot([
                {
                    ttl: 60000,
                    limit: 100,
                },
            ]),
            common_module_1.CommonModule,
            auth_module_1.AuthModule,
            user_module_1.UserModule,
            product_module_1.ProductModule,
            chat_module_1.ChatModule,
            notification_module_1.NotificationModule,
            review_module_1.ReviewModule,
            s3_module_1.S3Module,
            fcm_module_1.FcmModule,
            health_module_1.HealthModule,
        ],
        controllers: [],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: auth_guard_1.AuthGuard,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: rbac_guard_1.RBACGuard,
            },
            {
                provide: core_1.APP_FILTER,
                useClass: forbidden_filter_1.ForbiddenExceptionFilter,
            },
            {
                provide: core_1.APP_FILTER,
                useClass: query_failed_filter_1.QueryFailedExceptionFilter,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map