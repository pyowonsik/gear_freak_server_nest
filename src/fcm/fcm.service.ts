import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as admin from 'firebase-admin';
import * as path from 'path';

import { FcmToken, DeviceType } from './entity/fcm-token.entity';
import { envVariableKeys } from '../common/const/env.const';

interface SendNotificationParams {
  userId: number;
  title: string;
  body: string;
  data?: Record<string, string>;
  includeNotification?: boolean;
}

@Injectable()
export class FcmService implements OnModuleInit {
  private firebaseApp: admin.app.App;

  constructor(
    @InjectRepository(FcmToken)
    private readonly fcmTokenRepository: Repository<FcmToken>,
    private readonly configService: ConfigService,
  ) {}

  onModuleInit() {
    this.initializeFirebase();
  }

  private initializeFirebase() {
    try {
      const serviceAccountPath = this.configService.get<string>(
        envVariableKeys.fcmServiceAccountPath,
      );

      if (!serviceAccountPath) {
        console.warn('FCM service account path not configured');
        return;
      }

      const absolutePath = path.isAbsolute(serviceAccountPath)
        ? serviceAccountPath
        : path.join(process.cwd(), serviceAccountPath);

      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const serviceAccount = require(absolutePath);

      this.firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });

      console.log('Firebase Admin initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Firebase Admin:', error);
    }
  }

  /**
   * Register FCM token
   */
  async registerToken(
    userId: number,
    token: string,
    deviceType: DeviceType,
  ): Promise<FcmToken> {
    // Check if token already exists
    let fcmToken = await this.fcmTokenRepository.findOne({
      where: { token },
    });

    if (fcmToken) {
      // Update existing token
      fcmToken.userId = userId;
      fcmToken.deviceType = deviceType;
      fcmToken.lastUsedAt = new Date();
    } else {
      // Create new token
      fcmToken = this.fcmTokenRepository.create({
        userId,
        token,
        deviceType,
        lastUsedAt: new Date(),
      });
    }

    return this.fcmTokenRepository.save(fcmToken);
  }

  /**
   * Delete FCM token
   */
  async deleteToken(userId: number, token: string): Promise<void> {
    await this.fcmTokenRepository.delete({
      userId,
      token,
    });
  }

  /**
   * Delete all tokens for user (on logout)
   */
  async deleteAllUserTokens(userId: number): Promise<void> {
    await this.fcmTokenRepository.delete({ userId });
  }

  /**
   * Get all tokens for user
   */
  async getUserTokens(userId: number): Promise<FcmToken[]> {
    return this.fcmTokenRepository.find({
      where: { userId },
    });
  }

  /**
   * Send notification to user
   */
  async sendNotificationToUser(params: SendNotificationParams): Promise<{
    successCount: number;
    failureCount: number;
  }> {
    if (!this.firebaseApp) {
      console.warn('Firebase not initialized, skipping notification');
      return { successCount: 0, failureCount: 0 };
    }

    const tokens = await this.getUserTokens(params.userId);

    if (tokens.length === 0) {
      return { successCount: 0, failureCount: 0 };
    }

    const results = await Promise.all(
      tokens.map((fcmToken) =>
        this.sendToToken({
          token: fcmToken.token,
          title: params.title,
          body: params.body,
          data: params.data,
          includeNotification: params.includeNotification ?? true,
        }),
      ),
    );

    // Remove invalid tokens
    const invalidTokens = tokens.filter((_, index) => !results[index]);
    if (invalidTokens.length > 0) {
      await this.fcmTokenRepository.delete(
        invalidTokens.map((t) => t.id),
      );
    }

    return {
      successCount: results.filter(Boolean).length,
      failureCount: results.filter((r) => !r).length,
    };
  }

  /**
   * Send notification to multiple users
   */
  async sendNotificationToUsers(
    userIds: number[],
    title: string,
    body: string,
    data?: Record<string, string>,
  ): Promise<void> {
    await Promise.all(
      userIds.map((userId) =>
        this.sendNotificationToUser({ userId, title, body, data }),
      ),
    );
  }

  // ==================== Private Methods ====================

  private async sendToToken(params: {
    token: string;
    title: string;
    body: string;
    data?: Record<string, string>;
    includeNotification: boolean;
  }): Promise<boolean> {
    try {
      const message: admin.messaging.Message = {
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
    } catch (error) {
      console.error('FCM send error:', error);
      return false;
    }
  }
}
