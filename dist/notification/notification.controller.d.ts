import { NotificationService } from './notification.service';
import { PagePaginationDto, PaginationResponseDto } from '../common/dto';
import { NotificationResponseDto } from './dto';
export declare class NotificationController {
    private readonly notificationService;
    constructor(notificationService: NotificationService);
    getNotifications(userId: number, dto: PagePaginationDto): Promise<PaginationResponseDto<NotificationResponseDto>>;
    markAsRead(userId: number, notificationId: number): Promise<{
        message: string;
    }>;
    deleteNotification(userId: number, notificationId: number): Promise<{
        message: string;
    }>;
    getUnreadCount(userId: number): Promise<{
        unreadCount: number;
    }>;
    markAllAsRead(userId: number): Promise<{
        message: string;
    }>;
}
