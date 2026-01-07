import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseInterceptors } from '@nestjs/common';

import { ChatService } from './chat.service';
import { AuthService } from '../auth/auth.service';
import { FcmService } from '../fcm/fcm.service';
import { WsTransactionInterceptor } from '../common/interceptor';
import { WsQueryRunner } from '../common/decorator';
import { SendMessageDto } from './dto';
import type { QueryRunner } from 'typeorm';

@WebSocketGateway({
  namespace: '/chat',
  cors: {
    origin: '*',
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly chatService: ChatService,
    private readonly authService: AuthService,
    private readonly fcmService: FcmService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.query.token as string;

      if (!token) {
        client.disconnect();
        return;
      }

      const payload = await this.authService.verifyBearerToken(token, false);

      if (!payload || payload.type !== 'access') {
        client.disconnect();
        return;
      }

      // Store user info in socket
      client.data.user = payload;

      // Register client
      this.chatService.registerClient(payload.sub, client);

      // Join all user's chat rooms
      const chatRooms = await this.chatService.getUserChatRooms(payload.sub);
      for (const room of chatRooms) {
        client.join(`chat_room_${room.id}`);
      }

      console.log(`Client connected: userId=${payload.sub}`);
    } catch (error) {
      console.error('WebSocket connection error:', error);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const user = client.data.user;
    if (user) {
      this.chatService.removeClient(user.sub);
      console.log(`Client disconnected: userId=${user.sub}`);
    }
  }

  @SubscribeMessage('sendMessage')
  @UseInterceptors(WsTransactionInterceptor)
  async handleSendMessage(
    @MessageBody() dto: SendMessageDto,
    @ConnectedSocket() client: Socket,
    @WsQueryRunner() qr: QueryRunner,
  ) {
    const user = client.data.user;

    if (!user) {
      return { error: 'Unauthorized' };
    }

    try {
      const message = await this.chatService.sendMessage(user.sub, dto, qr);

      // Broadcast to room
      this.server
        .to(`chat_room_${dto.chatRoomId}`)
        .emit('newMessage', message);

      // Send FCM to offline users
      const participantIds = await this.chatService.getChatRoomParticipantIds(
        dto.chatRoomId,
        user.sub,
      );

      for (const participantId of participantIds) {
        // Check if user is online
        const participantClient = this.chatService.getClient(participantId);
        if (!participantClient) {
          // User is offline, send FCM
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
    } catch (error) {
      console.error('Send message error:', error);
      return { error: error.message };
    }
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @MessageBody() data: { chatRoomId: number },
    @ConnectedSocket() client: Socket,
  ) {
    const user = client.data.user;

    if (!user) {
      return { error: 'Unauthorized' };
    }

    client.join(`chat_room_${data.chatRoomId}`);
    return { success: true };
  }

  @SubscribeMessage('leaveRoom')
  async handleLeaveRoom(
    @MessageBody() data: { chatRoomId: number },
    @ConnectedSocket() client: Socket,
  ) {
    const user = client.data.user;

    if (!user) {
      return { error: 'Unauthorized' };
    }

    client.leave(`chat_room_${data.chatRoomId}`);
    return { success: true };
  }

  @SubscribeMessage('markAsRead')
  async handleMarkAsRead(
    @MessageBody() data: { chatRoomId: number },
    @ConnectedSocket() client: Socket,
  ) {
    const user = client.data.user;

    if (!user) {
      return { error: 'Unauthorized' };
    }

    try {
      await this.chatService.markChatRoomAsRead(user.sub, data.chatRoomId);
      return { success: true };
    } catch (error) {
      return { error: error.message };
    }
  }

  @SubscribeMessage('typing')
  async handleTyping(
    @MessageBody() data: { chatRoomId: number; isTyping: boolean },
    @ConnectedSocket() client: Socket,
  ) {
    const user = client.data.user;

    if (!user) {
      return { error: 'Unauthorized' };
    }

    // Broadcast typing status to room
    client.to(`chat_room_${data.chatRoomId}`).emit('userTyping', {
      userId: user.sub,
      isTyping: data.isTyping,
    });

    return { success: true };
  }
}
