import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryRunner, In, MoreThan, Not } from 'typeorm';
import { Socket } from 'socket.io';

import { ChatRoom, ChatRoomType } from './entity/chat-room.entity';
import { ChatParticipant } from './entity/chat-participant.entity';
import { ChatMessage, MessageType } from './entity/chat-message.entity';
import { Product } from '../product/entity/product.entity';
import {
  CreateChatRoomDto,
  SendMessageDto,
  GetChatMessagesDto,
  ChatRoomResponseDto,
  ChatMessageResponseDto,
  ChatParticipantResponseDto,
} from './dto';
import { CursorPaginationResponseDto } from '../common/dto';

@Injectable()
export class ChatService {
  // Store connected clients by userId
  private connectedClients: Map<number, Socket> = new Map();

  constructor(
    @InjectRepository(ChatRoom)
    private readonly chatRoomRepository: Repository<ChatRoom>,
    @InjectRepository(ChatParticipant)
    private readonly participantRepository: Repository<ChatParticipant>,
    @InjectRepository(ChatMessage)
    private readonly messageRepository: Repository<ChatMessage>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  /**
   * Register connected client
   */
  registerClient(userId: number, client: Socket): void {
    this.connectedClients.set(userId, client);
  }

  /**
   * Remove connected client
   */
  removeClient(userId: number): void {
    this.connectedClients.delete(userId);
  }

  /**
   * Get client by user ID
   */
  getClient(userId: number): Socket | undefined {
    return this.connectedClients.get(userId);
  }

  /**
   * Create or get chat room
   */
  async createOrGetChatRoom(
    userId: number,
    dto: CreateChatRoomDto,
    qr?: QueryRunner,
  ): Promise<ChatRoomResponseDto> {
    const roomRepo = qr
      ? qr.manager.getRepository(ChatRoom)
      : this.chatRoomRepository;
    const participantRepo = qr
      ? qr.manager.getRepository(ChatParticipant)
      : this.participantRepository;

    const product = await this.productRepository.findOne({
      where: { id: dto.productId },
      relations: ['seller'],
    });

    if (!product) {
      throw new NotFoundException('상품을 찾을 수 없습니다.');
    }

    if (product.sellerId === userId) {
      throw new BadRequestException('자신의 상품에는 채팅을 시작할 수 없습니다.');
    }

    // Check if chat room already exists
    const existingParticipant = await participantRepo
      .createQueryBuilder('p')
      .innerJoin('p.chatRoom', 'cr')
      .innerJoin(
        ChatParticipant,
        'p2',
        'p2.chatRoomId = cr.id AND p2.userId = :sellerId',
        { sellerId: dto.sellerId },
      )
      .where('cr.productId = :productId', { productId: dto.productId })
      .andWhere('p.userId = :userId', { userId })
      .getOne();

    if (existingParticipant) {
      return this.getChatRoomById(existingParticipant.chatRoomId, userId);
    }

    // Create new chat room
    const chatRoom = roomRepo.create({
      productId: dto.productId,
      chatRoomType: ChatRoomType.direct,
      participantCount: 2,
      lastActivityAt: new Date(),
    });

    const savedRoom = await roomRepo.save(chatRoom);

    // Add participants
    const buyerParticipant = participantRepo.create({
      chatRoomId: savedRoom.id,
      userId,
      isActive: true,
      joinedAt: new Date(),
    });

    const sellerParticipant = participantRepo.create({
      chatRoomId: savedRoom.id,
      userId: dto.sellerId,
      isActive: true,
      joinedAt: new Date(),
    });

    await participantRepo.save([buyerParticipant, sellerParticipant]);

    // Update product chat count
    await this.productRepository.increment({ id: dto.productId }, 'chatCount', 1);

    return this.getChatRoomById(savedRoom.id, userId);
  }

  /**
   * Get chat room by ID
   */
  async getChatRoomById(
    chatRoomId: number,
    userId: number,
  ): Promise<ChatRoomResponseDto> {
    const chatRoom = await this.chatRoomRepository.findOne({
      where: { id: chatRoomId },
      relations: ['product'],
    });

    if (!chatRoom) {
      throw new NotFoundException('채팅방을 찾을 수 없습니다.');
    }

    // Check if user is participant
    const participant = await this.participantRepository.findOne({
      where: { chatRoomId, userId },
    });

    if (!participant) {
      throw new ForbiddenException('채팅방에 참여하지 않은 사용자입니다.');
    }

    // Get other participant
    const otherParticipant = await this.participantRepository.findOne({
      where: { chatRoomId, userId: Not(userId) },
      relations: ['user'],
    });

    // Get last message
    const lastMessage = await this.messageRepository.findOne({
      where: { chatRoomId },
      order: { createdAt: 'DESC' },
    });

    // Get unread count
    const unreadCount = participant.lastReadMessageId
      ? await this.messageRepository.count({
          where: {
            chatRoomId,
            id: MoreThan(participant.lastReadMessageId),
            senderId: Not(userId),
          },
        })
      : await this.messageRepository.count({
          where: { chatRoomId, senderId: Not(userId) },
        });

    return {
      id: chatRoom.id,
      productId: chatRoom.productId,
      productTitle: chatRoom.product?.title || '',
      productThumbnail: chatRoom.product?.imageUrls?.[0],
      otherUser: {
        id: otherParticipant?.user?.id || 0,
        nickname: otherParticipant?.user?.nickname,
        profileImageUrl: otherParticipant?.user?.profileImageUrl,
      },
      lastMessage: lastMessage
        ? {
            content: lastMessage.content,
            messageType: lastMessage.messageType,
            createdAt: lastMessage.createdAt,
          }
        : undefined,
      unreadCount,
      lastActivityAt: chatRoom.lastActivityAt,
    };
  }

  /**
   * Get my chat rooms
   */
  async getMyChatRooms(
    userId: number,
    page: number = 1,
    limit: number = 20,
  ): Promise<{ items: ChatRoomResponseDto[]; total: number }> {
    const offset = (page - 1) * limit;

    const [participants, total] = await this.participantRepository.findAndCount(
      {
        where: { userId, isActive: true },
        relations: ['chatRoom'],
        order: { chatRoom: { lastActivityAt: 'DESC' } },
        skip: offset,
        take: limit,
      },
    );

    const chatRooms = await Promise.all(
      participants.map((p) => this.getChatRoomById(p.chatRoomId, userId)),
    );

    return { items: chatRooms, total };
  }

  /**
   * Send message
   */
  async sendMessage(
    userId: number,
    dto: SendMessageDto,
    qr?: QueryRunner,
  ): Promise<ChatMessageResponseDto> {
    const messageRepo = qr
      ? qr.manager.getRepository(ChatMessage)
      : this.messageRepository;
    const roomRepo = qr
      ? qr.manager.getRepository(ChatRoom)
      : this.chatRoomRepository;

    // Verify user is participant
    const participant = await this.participantRepository.findOne({
      where: { chatRoomId: dto.chatRoomId, userId, isActive: true },
    });

    if (!participant) {
      throw new ForbiddenException('채팅방에 참여하지 않은 사용자입니다.');
    }

    // Create message
    const message = messageRepo.create({
      chatRoomId: dto.chatRoomId,
      senderId: userId,
      messageType: dto.messageType,
      content: dto.content,
      attachmentUrl: dto.attachmentUrl,
      attachmentName: dto.attachmentName,
      attachmentSize: dto.attachmentSize,
    });

    const savedMessage = await messageRepo.save(message);

    // Update chat room last activity
    await roomRepo.update(dto.chatRoomId, { lastActivityAt: new Date() });

    // Load sender info
    const messageWithSender = await messageRepo.findOne({
      where: { id: savedMessage.id },
      relations: ['sender'],
    });

    return this.toMessageResponse(messageWithSender!);
  }

  /**
   * Get chat messages
   */
  async getChatMessages(
    userId: number,
    chatRoomId: number,
    dto: GetChatMessagesDto,
  ): Promise<CursorPaginationResponseDto<ChatMessageResponseDto>> {
    const { cursor } = dto;
    const limit = dto.limit || 20;

    // Verify user is participant
    const participant = await this.participantRepository.findOne({
      where: { chatRoomId, userId },
    });

    if (!participant) {
      throw new ForbiddenException('채팅방에 참여하지 않은 사용자입니다.');
    }

    const queryBuilder = this.messageRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.sender', 'sender')
      .where('message.chatRoomId = :chatRoomId', { chatRoomId })
      .orderBy('message.id', 'DESC')
      .take(limit + 1);

    if (cursor) {
      queryBuilder.andWhere('message.id < :cursor', { cursor });
    }

    const messages = await queryBuilder.getMany();

    const hasMore = messages.length > limit;
    if (hasMore) {
      messages.pop();
    }

    const items = messages.map((m) => this.toMessageResponse(m));

    return new CursorPaginationResponseDto(items, limit, hasMore);
  }

  /**
   * Mark chat room as read
   */
  async markChatRoomAsRead(userId: number, chatRoomId: number): Promise<void> {
    const participant = await this.participantRepository.findOne({
      where: { chatRoomId, userId },
    });

    if (!participant) {
      throw new ForbiddenException('채팅방에 참여하지 않은 사용자입니다.');
    }

    // Get latest message ID
    const lastMessage = await this.messageRepository.findOne({
      where: { chatRoomId },
      order: { id: 'DESC' },
    });

    if (lastMessage) {
      participant.lastReadMessageId = lastMessage.id;
      await this.participantRepository.save(participant);
    }
  }

  /**
   * Get total unread chat count
   */
  async getTotalUnreadChatCount(userId: number): Promise<number> {
    const participants = await this.participantRepository.find({
      where: { userId, isActive: true },
    });

    let totalUnread = 0;

    for (const participant of participants) {
      const unreadCount = participant.lastReadMessageId
        ? await this.messageRepository.count({
            where: {
              chatRoomId: participant.chatRoomId,
              id: MoreThan(participant.lastReadMessageId),
              senderId: Not(userId),
            },
          })
        : await this.messageRepository.count({
            where: {
              chatRoomId: participant.chatRoomId,
              senderId: Not(userId),
            },
          });

      totalUnread += unreadCount;
    }

    return totalUnread;
  }

  /**
   * Get user's chat rooms for WebSocket joining
   */
  async getUserChatRooms(userId: number): Promise<ChatRoom[]> {
    const participants = await this.participantRepository.find({
      where: { userId, isActive: true },
      relations: ['chatRoom'],
    });

    return participants.map((p) => p.chatRoom);
  }

  /**
   * Get participant IDs for a chat room (for sending FCM)
   */
  async getChatRoomParticipantIds(
    chatRoomId: number,
    excludeUserId?: number,
  ): Promise<number[]> {
    const participants = await this.participantRepository.find({
      where: { chatRoomId, isActive: true, isNotificationEnabled: true },
    });

    return participants
      .filter((p) => p.userId !== excludeUserId)
      .map((p) => p.userId);
  }

  /**
   * Get chat rooms by product ID
   */
  async getChatRoomsByProductId(
    productId: number,
  ): Promise<ChatRoomResponseDto[]> {
    const rooms = await this.chatRoomRepository.find({
      where: { productId },
      relations: ['product'],
      order: { lastActivityAt: 'DESC' },
    });

    return Promise.all(
      rooms.map(async (room) => {
        const lastMessage = await this.messageRepository.findOne({
          where: { chatRoomId: room.id },
          order: { createdAt: 'DESC' },
        });

        return {
          id: room.id,
          productId: room.productId,
          productTitle: room.product?.title || '',
          productThumbnail: room.product?.imageUrls?.[0],
          otherUser: {
            id: 0,
            nickname: undefined,
            profileImageUrl: undefined,
          },
          lastMessage: lastMessage
            ? {
                content: lastMessage.content,
                messageType: lastMessage.messageType,
                createdAt: lastMessage.createdAt,
              }
            : undefined,
          unreadCount: 0,
          lastActivityAt: room.lastActivityAt,
        };
      }),
    );
  }

  /**
   * Get user's chat rooms by product ID
   */
  async getUserChatRoomsByProductId(
    userId: number,
    productId: number,
  ): Promise<ChatRoomResponseDto[]> {
    const participants = await this.participantRepository.find({
      where: { userId, isActive: true },
      relations: ['chatRoom', 'chatRoom.product'],
    });

    const productRooms = participants.filter(
      (p) => p.chatRoom.productId === productId,
    );

    return Promise.all(
      productRooms.map(async (participant) => {
        const room = participant.chatRoom;

        // Get other participant
        const otherParticipant = await this.participantRepository.findOne({
          where: { chatRoomId: room.id, userId: Not(userId) },
          relations: ['user'],
        });

        // Get last message
        const lastMessage = await this.messageRepository.findOne({
          where: { chatRoomId: room.id },
          order: { createdAt: 'DESC' },
        });

        // Get unread count
        const unreadCount = participant.lastReadMessageId
          ? await this.messageRepository.count({
              where: {
                chatRoomId: room.id,
                id: MoreThan(participant.lastReadMessageId),
                senderId: Not(userId),
              },
            })
          : await this.messageRepository.count({
              where: { chatRoomId: room.id, senderId: Not(userId) },
            });

        return {
          id: room.id,
          productId: room.productId,
          productTitle: room.product?.title || '',
          productThumbnail: room.product?.imageUrls?.[0],
          otherUser: {
            id: otherParticipant?.user?.id || 0,
            nickname: otherParticipant?.user?.nickname,
            profileImageUrl: otherParticipant?.user?.profileImageUrl,
          },
          lastMessage: lastMessage
            ? {
                content: lastMessage.content,
                messageType: lastMessage.messageType,
                createdAt: lastMessage.createdAt,
              }
            : undefined,
          unreadCount,
          lastActivityAt: room.lastActivityAt,
        };
      }),
    );
  }

  /**
   * Get last message by chat room ID
   */
  async getLastMessageByChatRoomId(
    chatRoomId: number,
  ): Promise<ChatMessageResponseDto | null> {
    const message = await this.messageRepository.findOne({
      where: { chatRoomId },
      relations: ['sender'],
      order: { id: 'DESC' },
    });

    if (!message) {
      return null;
    }

    return this.toMessageResponse(message);
  }

  /**
   * Get chat room participants
   */
  async getChatParticipants(
    chatRoomId: number,
  ): Promise<ChatParticipantResponseDto[]> {
    const chatRoom = await this.chatRoomRepository.findOne({
      where: { id: chatRoomId },
    });

    if (!chatRoom) {
      throw new NotFoundException('채팅방을 찾을 수 없습니다.');
    }

    const participants = await this.participantRepository.find({
      where: { chatRoomId },
      relations: ['user'],
    });

    return participants.map((participant) => ({
      userId: participant.userId,
      user: {
        id: participant.user?.id || 0,
        nickname: participant.user?.nickname,
        profileImageUrl: participant.user?.profileImageUrl,
      },
      isActive: participant.isActive,
      isNotificationEnabled: participant.isNotificationEnabled,
      joinedAt: participant.joinedAt,
      lastReadMessageId: participant.lastReadMessageId,
    }));
  }

  /**
   * Update chat room notification settings
   */
  async updateChatRoomNotification(
    userId: number,
    chatRoomId: number,
    isNotificationEnabled: boolean,
  ): Promise<void> {
    const participant = await this.participantRepository.findOne({
      where: { chatRoomId, userId },
    });

    if (!participant) {
      throw new ForbiddenException('채팅방에 참여하지 않은 사용자입니다.');
    }

    participant.isNotificationEnabled = isNotificationEnabled;
    await this.participantRepository.save(participant);
  }

  // ==================== Private Methods ====================

  private toMessageResponse(message: ChatMessage): ChatMessageResponseDto {
    return {
      id: message.id,
      chatRoomId: message.chatRoomId,
      senderId: message.senderId,
      messageType: message.messageType,
      content: message.content,
      attachmentUrl: message.attachmentUrl,
      attachmentName: message.attachmentName,
      attachmentSize: message.attachmentSize,
      createdAt: message.createdAt,
      sender: {
        id: message.sender?.id,
        nickname: message.sender?.nickname,
        profileImageUrl: message.sender?.profileImageUrl,
      },
    };
  }
}
