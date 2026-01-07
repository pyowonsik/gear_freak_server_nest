import { Repository } from 'typeorm';
import { Notification, NotificationType } from './entity/notification.entity';
import { NotificationResponseDto } from './dto';
import { PaginationResponseDto } from '../common/dto';
import { FcmService } from '../fcm/fcm.service';
export declare class NotificationService {
    private readonly notificationRepository;
    private readonly fcmService;
    constructor(notificationRepository: Repository<Notification>, fcmService: FcmService);
    createNotification(params: {
        userId: number;
        type: NotificationType;
        title: string;
        body: string;
        data?: Record<string, any>;
        referenceId?: number;
        referenceType?: string;
        sendPush?: boolean;
    }): Promise<Notification>;
    getNotifications(userId: number, page?: number, limit?: number): Promise<PaginationResponseDto<NotificationResponseDto>>;
    markAsRead(userId: number, notificationId: number): Promise<void>;
    deleteNotification(userId: number, notificationId: number): Promise<void>;
    getUnreadCount(userId: number): Promise<number>;
    markAllAsRead(userId: number): Promise<void>;
    private toNotificationResponse;
}
