import { Repository, QueryRunner } from 'typeorm';
import { Socket } from 'socket.io';
import { ChatRoom } from './entity/chat-room.entity';
import { ChatParticipant } from './entity/chat-participant.entity';
import { ChatMessage } from './entity/chat-message.entity';
import { Product } from '../product/entity/product.entity';
import { CreateChatRoomDto, SendMessageDto, GetChatMessagesDto, ChatRoomResponseDto, ChatMessageResponseDto, ChatParticipantResponseDto } from './dto';
import { CursorPaginationResponseDto } from '../common/dto';
export declare class ChatService {
    private readonly chatRoomRepository;
    private readonly participantRepository;
    private readonly messageRepository;
    private readonly productRepository;
    private connectedClients;
    constructor(chatRoomRepository: Repository<ChatRoom>, participantRepository: Repository<ChatParticipant>, messageRepository: Repository<ChatMessage>, productRepository: Repository<Product>);
    registerClient(userId: number, client: Socket): void;
    removeClient(userId: number): void;
    getClient(userId: number): Socket | undefined;
    createOrGetChatRoom(userId: number, dto: CreateChatRoomDto, qr?: QueryRunner): Promise<ChatRoomResponseDto>;
    getChatRoomById(chatRoomId: number, userId: number): Promise<ChatRoomResponseDto>;
    getMyChatRooms(userId: number, page?: number, limit?: number): Promise<{
        items: ChatRoomResponseDto[];
        total: number;
    }>;
    sendMessage(userId: number, dto: SendMessageDto, qr?: QueryRunner): Promise<ChatMessageResponseDto>;
    getChatMessages(userId: number, chatRoomId: number, dto: GetChatMessagesDto): Promise<CursorPaginationResponseDto<ChatMessageResponseDto>>;
    markChatRoomAsRead(userId: number, chatRoomId: number): Promise<void>;
    getTotalUnreadChatCount(userId: number): Promise<number>;
    getUserChatRooms(userId: number): Promise<ChatRoom[]>;
    getChatRoomParticipantIds(chatRoomId: number, excludeUserId?: number): Promise<number[]>;
    getChatRoomsByProductId(productId: number): Promise<ChatRoomResponseDto[]>;
    getUserChatRoomsByProductId(userId: number, productId: number): Promise<ChatRoomResponseDto[]>;
    getLastMessageByChatRoomId(chatRoomId: number): Promise<ChatMessageResponseDto | null>;
    getChatParticipants(chatRoomId: number): Promise<ChatParticipantResponseDto[]>;
    updateChatRoomNotification(userId: number, chatRoomId: number, isNotificationEnabled: boolean): Promise<void>;
    private toMessageResponse;
}
