import type { QueryRunner as QR } from 'typeorm';
import { ChatService } from './chat.service';
import { PagePaginationDto, CursorPaginationResponseDto } from '../common/dto';
import { CreateChatRoomDto, GetChatMessagesDto, ChatRoomResponseDto, ChatMessageResponseDto, ChatParticipantResponseDto, UpdateChatRoomNotificationDto } from './dto';
import { S3Service } from '../s3/s3.service';
import { GeneratePresignedUrlDto, PresignedUrlResponseDto } from '../s3/dto';
export declare class ChatController {
    private readonly chatService;
    private readonly s3Service;
    constructor(chatService: ChatService, s3Service: S3Service);
    createOrGetChatRoom(userId: number, dto: CreateChatRoomDto, qr: QR): Promise<ChatRoomResponseDto>;
    getMyChatRooms(userId: number, dto: PagePaginationDto): Promise<{
        items: ChatRoomResponseDto[];
        total: number;
    }>;
    getChatRoomById(userId: number, chatRoomId: number): Promise<ChatRoomResponseDto>;
    getChatMessages(userId: number, chatRoomId: number, dto: GetChatMessagesDto): Promise<CursorPaginationResponseDto<ChatMessageResponseDto>>;
    markChatRoomAsRead(userId: number, chatRoomId: number): Promise<{
        message: string;
    }>;
    getTotalUnreadChatCount(userId: number): Promise<{
        unreadCount: number;
    }>;
    getChatRoomsByProductId(productId: number): Promise<ChatRoomResponseDto[]>;
    getUserChatRoomsByProductId(userId: number, productId: number): Promise<ChatRoomResponseDto[]>;
    getLastMessageByChatRoomId(chatRoomId: number): Promise<ChatMessageResponseDto | null>;
    generateChatRoomImageUploadUrl(userId: number, chatRoomId: number, dto: GeneratePresignedUrlDto): Promise<PresignedUrlResponseDto>;
    getChatParticipants(chatRoomId: number): Promise<ChatParticipantResponseDto[]>;
    updateChatRoomNotification(userId: number, chatRoomId: number, dto: UpdateChatRoomNotificationDto): Promise<{
        message: string;
    }>;
}
