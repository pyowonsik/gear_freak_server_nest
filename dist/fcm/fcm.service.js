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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FcmService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const admin = __importStar(require("firebase-admin"));
const path = __importStar(require("path"));
const fcm_token_entity_1 = require("./entity/fcm-token.entity");
const env_const_1 = require("../common/const/env.const");
let FcmService = class FcmService {
    fcmTokenRepository;
    configService;
    firebaseApp;
    constructor(fcmTokenRepository, configService) {
        this.fcmTokenRepository = fcmTokenRepository;
        this.configService = configService;
    }
    onModuleInit() {
        this.initializeFirebase();
    }
    initializeFirebase() {
        try {
            const serviceAccountPath = this.configService.get(env_const_1.envVariableKeys.fcmServiceAccountPath);
            if (!serviceAccountPath) {
                console.warn('FCM service account path not configured');
                return;
            }
            const absolutePath = path.isAbsolute(serviceAccountPath)
                ? serviceAccountPath
                : path.join(process.cwd(), serviceAccountPath);
            const serviceAccount = require(absolutePath);
            this.firebaseApp = admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
            });
            console.log('Firebase Admin initialized successfully');
        }
        catch (error) {
            console.error('Failed to initialize Firebase Admin:', error);
        }
    }
    async registerToken(userId, token, deviceType) {
        let fcmToken = await this.fcmTokenRepository.findOne({
            where: { token },
        });
        if (fcmToken) {
            fcmToken.userId = userId;
            fcmToken.deviceType = deviceType;
            fcmToken.lastUsedAt = new Date();
        }
        else {
            fcmToken = this.fcmTokenRepository.create({
                userId,
                token,
                deviceType,
                lastUsedAt: new Date(),
            });
        }
        return this.fcmTokenRepository.save(fcmToken);
    }
    async deleteToken(userId, token) {
        await this.fcmTokenRepository.delete({
            userId,
            token,
        });
    }
    async deleteAllUserTokens(userId) {
        await this.fcmTokenRepository.delete({ userId });
    }
    async getUserTokens(userId) {
        return this.fcmTokenRepository.find({
            where: { userId },
        });
    }
    async sendNotificationToUser(params) {
        if (!this.firebaseApp) {
            console.warn('Firebase not initialized, skipping notification');
            return { successCount: 0, failureCount: 0 };
        }
        const tokens = await this.getUserTokens(params.userId);
        if (tokens.length === 0) {
            return { successCount: 0, failureCount: 0 };
        }
        const results = await Promise.all(tokens.map((fcmToken) => this.sendToToken({
            token: fcmToken.token,
            title: params.title,
            body: params.body,
            data: params.data,
            includeNotification: params.includeNotification ?? true,
        })));
        const invalidTokens = tokens.filter((_, index) => !results[index]);
        if (invalidTokens.length > 0) {
            await this.fcmTokenRepository.delete(invalidTokens.map((t) => t.id));
        }
        return {
            successCount: results.filter(Boolean).length,
            failureCount: results.filter((r) => !r).length,
        };
    }
    async sendNotificationToUsers(userIds, title, body, data) {
        await Promise.all(userIds.map((userId) => this.sendNotificationToUser({ userId, title, body, data })));
    }
    async sendToToken(params) {
        try {
            const message = {
                token: params.token,
                data: params.data || {},
                android: {
                    priority: 'high',
                    notification: params.includeNotification
                        ? {
                            channelId: 'gear_freak_channel',
                            priority: 'high',
                        }
                        : undefined,
                },
                apns: {
                    headers: {
                        'apns-priority': '10',
                    },
                    payload: {
                        aps: params.includeNotification
                            ? {
                                alert: {
                                    title: params.title,
                                    body: params.body,
                                },
                                sound: 'default',
                                badge: 1,
                            }
                            : {
                                'content-available': 1,
                            },
                    },
                },
            };
            if (params.includeNotification) {
                message.notification = {
                    title: params.title,
                    body: params.body,
                };
            }
            await this.firebaseApp.messaging().send(message);
            return true;
        }
        catch (error) {
            console.error('FCM send error:', error);
            return false;
        }
    }
};
exports.FcmService = FcmService;
exports.FcmService = FcmService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(fcm_token_entity_1.FcmToken)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        config_1.ConfigService])
], FcmService);
//# sourceMappingURL=fcm.service.js.map