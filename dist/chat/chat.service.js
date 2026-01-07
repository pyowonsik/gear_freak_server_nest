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
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const chat_room_entity_1 = require("./entity/chat-room.entity");
const chat_participant_entity_1 = require("./entity/chat-participant.entity");
const chat_message_entity_1 = require("./entity/chat-message.entity");
const product_entity_1 = require("../product/entity/product.entity");
const dto_1 = require("../common/dto");
let ChatService = class ChatService {
    chatRoomRepository;
    participantRepository;
    messageRepository;
    productRepository;
    connectedClients = new Map();
    constructor(chatRoomRepository, participantRepository, messageRepository, productRepository) {
        this.chatRoomRepository = chatRoomRepository;
        this.participantRepository = participantRepository;
        this.messageRepository = messageRepository;
        this.productRepository = productRepository;
    }
    registerClient(userId, client) {
        this.connectedClients.set(userId, client);
    }
    removeClient(userId) {
        this.connectedClients.delete(userId);
    }
    getClient(userId) {
        return this.connectedClients.get(userId);
    }
    async createOrGetChatRoom(userId, dto, qr) {
        const roomRepo = qr
            ? qr.manager.getRepository(chat_room_entity_1.ChatRoom)
            : this.chatRoomRepository;
        const participantRepo = qr
            ? qr.manager.getRepository(chat_participant_entity_1.ChatParticipant)
            : this.participantRepository;
        const product = await this.productRepository.findOne({
            where: { id: dto.productId },
            relations: ['seller'],
        });
        if (!product) {
            throw new common_1.NotFoundException('상품을 찾을 수 없습니다.');
        }
        if (product.sellerId === userId) {
            throw new common_1.BadRequestException('자신의 상품에는 채팅을 시작할 수 없습니다.');
        }
        const existingParticipant = await participantRepo
            .createQueryBuilder('p')
            .innerJoin('p.chatRoom', 'cr')
            .innerJoin(chat_participant_entity_1.ChatParticipant, 'p2', 'p2.chatRoomId = cr.id AND p2.userId = :sellerId', { sellerId: dto.sellerId })
            .where('cr.productId = :productId', { productId: dto.productId })
            .andWhere('p.userId = :userId', { userId })
            .getOne();
        if (existingParticipant) {
            return this.getChatRoomById(existingParticipant.chatRoomId, userId);
        }
        const chatRoom = roomRepo.create({
            productId: dto.productId,
            chatRoomType: chat_room_entity_1.ChatRoomType.direct,
            participantCount: 2,
            lastActivityAt: new Date(),
        });
        const savedRoom = await roomRepo.save(chatRoom);
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
        await this.productRepository.increment({ id: dto.productId }, 'chatCount', 1);
        return this.getChatRoomById(savedRoom.id, userId);
    }
    async getChatRoomById(chatRoomId, userId) {
        const chatRoom = await this.chatRoomRepository.findOne({
            where: { id: chatRoomId },
            relations: ['product'],
        });
        if (!chatRoom) {
            throw new common_1.NotFoundException('채팅방을 찾을 수 없습니다.');
        }
        const participant = await this.participantRepository.findOne({
            where: { chatRoomId, userId },
        });
        if (!participant) {
            throw new common_1.ForbiddenException('채팅방에 참여하지 않은 사용자입니다.');
        }
        const otherParticipant = await this.participantRepository.findOne({
            where: { chatRoomId, userId: (0, typeorm_2.Not)(userId) },
            relations: ['user'],
        });
        const lastMessage = await this.messageRepository.findOne({
            where: { chatRoomId },
            order: { createdAt: 'DESC' },
        });
        const unreadCount = participant.lastReadMessageId
            ? await this.messageRepository.count({
                where: {
                    chatRoomId,
                    id: (0, typeorm_2.MoreThan)(participant.lastReadMessageId),
                    senderId: (0, typeorm_2.Not)(userId),
                },
            })
            : await this.messageRepository.count({
                where: { chatRoomId, senderId: (0, typeorm_2.Not)(userId) },
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
    async getMyChatRooms(userId, page = 1, limit = 20) {
        const offset = (page - 1) * limit;
        const [participants, total] = await this.participantRepository.findAndCount({
            where: { userId, isActive: true },
            relations: ['chatRoom'],
            order: { chatRoom: { lastActivityAt: 'DESC' } },
            skip: offset,
            take: limit,
        });
        const chatRooms = await Promise.all(participants.map((p) => this.getChatRoomById(p.chatRoomId, userId)));
        return { items: chatRooms, total };
    }
    async sendMessage(userId, dto, qr) {
        const messageRepo = qr
            ? qr.manager.getRepository(chat_message_entity_1.ChatMessage)
            : this.messageRepository;
        const roomRepo = qr
            ? qr.manager.getRepository(chat_room_entity_1.ChatRoom)
            : this.chatRoomRepository;
        const participant = await this.participantRepository.findOne({
            where: { chatRoomId: dto.chatRoomId, userId, isActive: true },
        });
        if (!participant) {
            throw new common_1.ForbiddenException('채팅방에 참여하지 않은 사용자입니다.');
        }
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
        await roomRepo.update(dto.chatRoomId, { lastActivityAt: new Date() });
        const messageWithSender = await messageRepo.findOne({
            where: { id: savedMessage.id },
            relations: ['sender'],
        });
        return this.toMessageResponse(messageWithSender);
    }
    async getChatMessages(userId, chatRoomId, dto) {
        const { cursor } = dto;
        const limit = dto.limit || 20;
        const participant = await this.participantRepository.findOne({
            where: { chatRoomId, userId },
        });
        if (!participant) {
            throw new common_1.ForbiddenException('채팅방에 참여하지 않은 사용자입니다.');
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
        return new dto_1.CursorPaginationResponseDto(items, limit, hasMore);
    }
    async markChatRoomAsRead(userId, chatRoomId) {
        const participant = await this.participantRepository.findOne({
            where: { chatRoomId, userId },
        });
        if (!participant) {
            throw new common_1.ForbiddenException('채팅방에 참여하지 않은 사용자입니다.');
        }
        const lastMessage = await this.messageRepository.findOne({
            where: { chatRoomId },
            order: { id: 'DESC' },
        });
        if (lastMessage) {
            participant.lastReadMessageId = lastMessage.id;
            await this.participantRepository.save(participant);
        }
    }
    async getTotalUnreadChatCount(userId) {
        const participants = await this.participantRepository.find({
            where: { userId, isActive: true },
        });
        let totalUnread = 0;
        for (const participant of participants) {
            const unreadCount = participant.lastReadMessageId
                ? await this.messageRepository.count({
                    where: {
                        chatRoomId: participant.chatRoomId,
                        id: (0, typeorm_2.MoreThan)(participant.lastReadMessageId),
                        senderId: (0, typeorm_2.Not)(userId),
                    },
                })
                : await this.messageRepository.count({
                    where: {
                        chatRoomId: participant.chatRoomId,
                        senderId: (0, typeorm_2.Not)(userId),
                    },
                });
            totalUnread += unreadCount;
        }
        return totalUnread;
    }
    async getUserChatRooms(userId) {
        const participants = await this.participantRepository.find({
            where: { userId, isActive: true },
            relations: ['chatRoom'],
        });
        return participants.map((p) => p.chatRoom);
    }
    async getChatRoomParticipantIds(chatRoomId, excludeUserId) {
        const participants = await this.participantRepository.find({
            where: { chatRoomId, isActive: true, isNotificationEnabled: true },
        });
        return participants
            .filter((p) => p.userId !== excludeUserId)
            .map((p) => p.userId);
    }
    async getChatRoomsByProductId(productId) {
        const rooms = await this.chatRoomRepository.find({
            where: { productId },
            relations: ['product'],
            order: { lastActivityAt: 'DESC' },
        });
        return Promise.all(rooms.map(async (room) => {
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
        }));
    }
    async getUserChatRoomsByProductId(userId, productId) {
        const participants = await this.participantRepository.find({
            where: { userId, isActive: true },
            relations: ['chatRoom', 'chatRoom.product'],
        });
        const productRooms = participants.filter((p) => p.chatRoom.productId === productId);
        return Promise.all(productRooms.map(async (participant) => {
            const room = participant.chatRoom;
            const otherParticipant = await this.participantRepository.findOne({
                where: { chatRoomId: room.id, userId: (0, typeorm_2.Not)(userId) },
                relations: ['user'],
            });
            const lastMessage = await this.messageRepository.findOne({
                where: { chatRoomId: room.id },
                order: { createdAt: 'DESC' },
            });
            const unreadCount = participant.lastReadMessageId
                ? await this.messageRepository.count({
                    where: {
                        chatRoomId: room.id,
                        id: (0, typeorm_2.MoreThan)(participant.lastReadMessageId),
                        senderId: (0, typeorm_2.Not)(userId),
                    },
                })
                : await this.messageRepository.count({
                    where: { chatRoomId: room.id, senderId: (0, typeorm_2.Not)(userId) },
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
        }));
    }
    async getLastMessageByChatRoomId(chatRoomId) {
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
    async getChatParticipants(chatRoomId) {
        const chatRoom = await this.chatRoomRepository.findOne({
            where: { id: chatRoomId },
        });
        if (!chatRoom) {
            throw new common_1.NotFoundException('채팅방을 찾을 수 없습니다.');
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
    async updateChatRoomNotification(userId, chatRoomId, isNotificationEnabled) {
        const participant = await this.participantRepository.findOne({
            where: { chatRoomId, userId },
        });
        if (!participant) {
            throw new common_1.ForbiddenException('채팅방에 참여하지 않은 사용자입니다.');
        }
        participant.isNotificationEnabled = isNotificationEnabled;
        await this.participantRepository.save(participant);
    }
    toMessageResponse(message) {
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
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(chat_room_entity_1.ChatRoom)),
    __param(1, (0, typeorm_1.InjectRepository)(chat_participant_entity_1.ChatParticipant)),
    __param(2, (0, typeorm_1.InjectRepository)(chat_message_entity_1.ChatMessage)),
    __param(3, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ChatService);
//# sourceMappingURL=chat.service.js.map