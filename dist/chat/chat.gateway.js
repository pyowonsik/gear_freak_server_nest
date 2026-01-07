"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
const chat_service_1 = require("./chat.service");
const auth_service_1 = require("../auth/auth.service");
const fcm_service_1 = require("../fcm/fcm.service");
const interceptor_1 = require("../common/interceptor");
const decorator_1 = require("../common/decorator");
const dto_1 = require("./dto");
let ChatGateway = class ChatGateway {
    chatService;
    authService;
    fcmService;
    server;
    constructor(chatService, authService, fcmService) {
        this.chatService = chatService;
        this.authService = authService;
        this.fcmService = fcmService;
    }
    async handleConnection(client) {
        try {
            const token = client.handshake.query.token;
            if (!token) {
                client.disconnect();
                return;
            }
            const payload = await this.authService.verifyBearerToken(token, false);
            if (!payload || payload.type !== 'access') {
                client.disconnect();
                return;
            }
            client.data.user = payload;
            this.chatService.registerClient(payload.sub, client);
            const chatRooms = await this.chatService.getUserChatRooms(payload.sub);
            for (const room of chatRooms) {
                client.join(`chat_room_${room.id}`);
            }
            console.log(`Client connected: userId=${payload.sub}`);
        }
        catch (error) {
            console.error('WebSocket connection error:', error);
            client.disconnect();
        }
    }
    handleDisconnect(client) {
        const user = client.data.user;
        if (user) {
            this.chatService.removeClient(user.sub);
            console.log(`Client disconnected: userId=${user.sub}`);
        }
    }
    async handleSendMessage(dto, client, qr) {
        const user = client.data.user;
        if (!user) {
            return { error: 'Unauthorized' };
        }
        try {
            const message = await this.chatService.sendMessage(user.sub, dto, qr);
            this.server
                .to(`chat_room_${dto.chatRoomId}`)
                .emit('newMessage', message);
            const participantIds = await this.chatService.getChatRoomParticipantIds(dto.chatRoomId, user.sub);
            for (const participantId of participantIds) {
                const participantClient = this.chatService.getClient(participantId);
                if (!participantClient) {
                    await this.fcmService.sendNotificationToUser({
                        userId: participantId,
                        title: '새 메시지',
                        body: dto.content || '이미지를 보냈습니다.',
                        data: {
                            type: 'chat_message',
                            chatRoomId: dto.chatRoomId.toString(),
                        },
                    });
                }
            }
            return { success: true, message };
        }
        catch (error) {
            console.error('Send message error:', error);
            return { error: error.message };
        }
    }
    async handleJoinRoom(data, client) {
        const user = client.data.user;
        if (!user) {
            return { error: 'Unauthorized' };
        }
        client.join(`chat_room_${data.chatRoomId}`);
        return { success: true };
    }
    async handleLeaveRoom(data, client) {
        const user = client.data.user;
        if (!user) {
            return { error: 'Unauthorized' };
        }
        client.leave(`chat_room_${data.chatRoomId}`);
        return { success: true };
    }
    async handleMarkAsRead(data, client) {
        const user = client.data.user;
        if (!user) {
            return { error: 'Unauthorized' };
        }
        try {
            await this.chatService.markChatRoomAsRead(user.sub, data.chatRoomId);
            return { success: true };
        }
        catch (error) {
            return { error: error.message };
        }
    }
    async handleTyping(data, client) {
        const user = client.data.user;
        if (!user) {
            return { error: 'Unauthorized' };
        }
        client.to(`chat_room_${data.chatRoomId}`).emit('userTyping', {
            userId: user.sub,
            isTyping: data.isTyping,
        });
        return { success: true };
    }
};
exports.ChatGateway = ChatGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('sendMessage'),
    (0, common_1.UseInterceptors)(interceptor_1.WsTransactionInterceptor),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __param(2, (0, decorator_1.WsQueryRunner)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.SendMessageDto,
        socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleSendMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('joinRoom'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleJoinRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leaveRoom'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleLeaveRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('markAsRead'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleMarkAsRead", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('typing'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleTyping", null);
exports.ChatGateway = ChatGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        namespace: '/chat',
        cors: {
            origin: '*',
            credentials: true,
        },
    }),
    __metadata("design:paramtypes", [chat_service_1.ChatService,
        auth_service_1.AuthService,
        fcm_service_1.FcmService])
], ChatGateway);
//# sourceMappingURL=chat.gateway.js.map