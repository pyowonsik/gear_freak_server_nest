import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Notification, NotificationType } from './entity/notification.entity';
import { NotificationResponseDto } from './dto';
import { PaginationResponseDto } from '../common/dto';
import { FcmService } from '../fcm/fcm.service';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    private readonly fcmService: FcmService,
  ) {}

  /**
   * Create notification and send push
   */
  async createNotification(params: {
    userId: number;
    type: NotificationType;
    title: string;
    body: string;
    data?: Record<string, any>;
    referenceId?: number;
    referenceType?: string;
    sendPush?: boolean;
  }): Promise<Notification> {
    const notification = this.notificationRepository.create({
      userId: params.userId,
      notificationType: params.type,
      title: params.title,
      body: params.body,
      data: params.data,
      referenceId: params.referenceId,
      referenceType: params.referenceType,
    });

    const savedNotification =
      await this.notificationRepository.save(notification);

    // Send push notification
    if (params.sendPush !== false) {
      await this.fcmService.sendNotificationToUser({
        userId: params.userId,
        title: params.title,
        body: params.body,
        data: {
          type: params.type,
          notificationId: savedNotification.id.toString(),
          ...Object.fromEntries(
            Object.entries(params.data || {}).map(([k, v]) => [k, String(v)]),
          ),
        },
      });
    }

    return savedNotification;
  }

  /**
   * Get notifications
   */
  async getNotifications(
    userId: number,
    page: number = 1,
    limit: number = 20,
  ): Promise<PaginationResponseDto<NotificationResponseDto>> {
    const offset = (page - 1) * limit;

    const [notifications, total] =
      await this.notificationRepository.findAndCount({
        where: { userId },
        order: { createdAt: 'DESC' },
        skip: offset,
        take: limit,
      });

    const items = notifications.map((n) => this.toNotificationResponse(n));

    return new PaginationResponseDto(items, total, page, limit);
  }

  /**
   * Mark notification as read
   */
  async markAsRead(userId: number, notificationId: number): Promise<void> {
    const notification = await this.notificationRepository.findOne({
      where: { id: notificationId, userId },
    });

    if (!notification) {
      throw new NotFoundException('알림을 찾을 수 없습니다.');
    }

    notification.isRead = true;
    notification.readAt = new Date();

    await this.notificationRepository.save(notification);
  }

  /**
   * Delete notification
   */
  async deleteNotification(
    userId: number,
    notificationId: number,
  ): Promise<void> {
    const notification = await this.notificationRepository.findOne({
      where: { id: notificationId, userId },
    });

    if (!notification) {
      throw new NotFoundException('알림을 찾을 수 없습니다.');
    }

    await this.notificationRepository.remove(notification);
  }

  /**
   * Get unread count
   */
  async getUnreadCount(userId: number): Promise<number> {
    return this.notificationRepository.count({
      where: { userId, isRead: false },
    });
  }

  /**
   * Mark all as read
   */
  async markAllAsRead(userId: number): Promise<void> {
    await this.notificationRepository.update(
      { userId, isRead: false },
      { isRead: true, readAt: new Date() },
    );
  }

  // ==================== Private Methods ====================

  private toNotificationResponse(
    notification: Notification,
  ): NotificationResponseDto {
    return {
      id: notification.id,
      notificationType: notification.notificationType,
      title: notification.title,
      body: notification.body,
      data: notification.data,
      isRead: notification.isRead,
      readAt: notification.readAt,
      createdAt: notification.createdAt,
    };
  }
}
