import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { FcmToken, DeviceType } from './entity/fcm-token.entity';
interface SendNotificationParams {
    userId: number;
    title: string;
    body: string;
    data?: Record<string, string>;
    includeNotification?: boolean;
}
export declare class FcmService implements OnModuleInit {
    private readonly fcmTokenRepository;
    private readonly configService;
    private firebaseApp;
    constructor(fcmTokenRepository: Repository<FcmToken>, configService: ConfigService);
    onModuleInit(): void;
    private initializeFirebase;
    registerToken(userId: number, token: string, deviceType: DeviceType): Promise<FcmToken>;
    deleteToken(userId: number, token: string): Promise<void>;
    deleteAllUserTokens(userId: number): Promise<void>;
    getUserTokens(userId: number): Promise<FcmToken[]>;
    sendNotificationToUser(params: SendNotificationParams): Promise<{
        successCount: number;
        failureCount: number;
    }>;
    sendNotificationToUsers(userIds: number[], title: string, body: string, data?: Record<string, string>): Promise<void>;
    private sendToToken;
}
export {};
