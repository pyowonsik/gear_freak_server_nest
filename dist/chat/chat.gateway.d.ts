import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { AuthService } from '../auth/auth.service';
import { FcmService } from '../fcm/fcm.service';
import { SendMessageDto } from './dto';
import type { QueryRunner } from 'typeorm';
export declare class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly chatService;
    private readonly authService;
    private readonly fcmService;
    server: Server;
    constructor(chatService: ChatService, authService: AuthService, fcmService: FcmService);
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): void;
    handleSendMessage(dto: SendMessageDto, client: Socket, qr: QueryRunner): Promise<{
        success: boolean;
        message: import("./dto").ChatMessageResponseDto;
        error?: undefined;
    } | {
        error: any;
        success?: undefined;
        message?: undefined;
    }>;
    handleJoinRoom(data: {
        chatRoomId: number;
    }, client: Socket): Promise<{
        error: string;
        success?: undefined;
    } | {
        success: boolean;
        error?: undefined;
    }>;
    handleLeaveRoom(data: {
        chatRoomId: number;
    }, client: Socket): Promise<{
        error: string;
        success?: undefined;
    } | {
        success: boolean;
        error?: undefined;
    }>;
    handleMarkAsRead(data: {
        chatRoomId: number;
    }, client: Socket): Promise<{
        success: boolean;
        error?: undefined;
    } | {
        error: any;
        success?: undefined;
    }>;
    handleTyping(data: {
        chatRoomId: number;
        isTyping: boolean;
    }, client: Socket): Promise<{
        error: string;
        success?: undefined;
    } | {
        success: boolean;
        error?: undefined;
    }>;
}
