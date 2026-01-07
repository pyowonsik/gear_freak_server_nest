import { MessageType } from '../entity/chat-message.entity';
import { CursorPaginationDto } from '../../common/dto';
export declare class CreateChatRoomDto {
    productId: number;
    sellerId: number;
}
export declare class SendMessageDto {
    chatRoomId: number;
    content?: string;
    messageType: MessageType;
    attachmentUrl?: string;
    attachmentName?: string;
    attachmentSize?: number;
}
export declare class GetChatMessagesDto extends CursorPaginationDto {
}
export declare class ChatRoomResponseDto {
    id: number;
    productId: number;
    productTitle: string;
    productThumbnail?: string;
    otherUser: {
        id: number;
        nickname?: string;
        profileImageUrl?: string;
    };
    lastMessage?: {
        content?: string;
        messageType: MessageType;
        createdAt: Date;
    };
    unreadCount: number;
    lastActivityAt: Date;
}
export declare class ChatMessageResponseDto {
    id: number;
    chatRoomId: number;
    senderId: number;
    messageType: MessageType;
    content?: string;
    attachmentUrl?: string;
    attachmentName?: string;
    attachmentSize?: number;
    createdAt: Date;
    sender: {
        id: number;
        nickname?: string;
        profileImageUrl?: string;
    };
}
export declare class ChatParticipantResponseDto {
    userId: number;
    user: {
        id: number;
        nickname?: string;
        profileImageUrl?: string;
    };
    isActive: boolean;
    isNotificationEnabled: boolean;
    joinedAt: Date;
    lastReadMessageId?: number;
}
export declare class UpdateChatRoomNotificationDto {
    isNotificationEnabled: boolean;
}
