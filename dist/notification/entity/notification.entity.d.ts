import { BaseTable } from '../../common/entity/base-table.entity';
import { User } from '../../user/entity/user.entity';
export declare enum NotificationType {
    chat_message = "chat_message",
    review_received = "review_received",
    product_favorited = "product_favorited",
    product_sold = "product_sold",
    system = "system"
}
export declare class Notification extends BaseTable {
    id: number;
    userId: number;
    user: User;
    notificationType: NotificationType;
    title: string;
    body: string;
    data: Record<string, any>;
    isRead: boolean;
    readAt: Date;
    referenceId: number;
    referenceType: string;
}
