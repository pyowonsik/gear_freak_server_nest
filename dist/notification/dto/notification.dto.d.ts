import { NotificationType } from '../entity/notification.entity';
export declare class NotificationResponseDto {
    id: number;
    notificationType: NotificationType;
    title: string;
    body: string;
    data?: Record<string, any>;
    isRead: boolean;
    readAt?: Date;
    createdAt: Date;
}
