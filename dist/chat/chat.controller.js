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
exports.ChatController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const chat_service_1 = require("./chat.service");
const decorator_1 = require("../common/decorator");
const interceptor_1 = require("../common/interceptor");
const dto_1 = require("../common/dto");
const dto_2 = require("./dto");
const s3_service_1 = require("../s3/s3.service");
const dto_3 = require("../s3/dto");
let ChatController = class ChatController {
    chatService;
    s3Service;
    constructor(chatService, s3Service) {
        this.chatService = chatService;
        this.s3Service = s3Service;
    }
    async createOrGetChatRoom(userId, dto, qr) {
        return this.chatService.createOrGetChatRoom(userId, dto, qr);
    }
    async getMyChatRooms(userId, dto) {
        return this.chatService.getMyChatRooms(userId, dto.page, dto.limit);
    }
    async getChatRoomById(userId, chatRoomId) {
        return this.chatService.getChatRoomById(chatRoomId, userId);
    }
    async getChatMessages(userId, chatRoomId, dto) {
        return this.chatService.getChatMessages(userId, chatRoomId, dto);
    }
    async markChatRoomAsRead(userId, chatRoomId) {
        await this.chatService.markChatRoomAsRead(userId, chatRoomId);
        return { message: '읽음 처리되었습니다.' };
    }
    async getTotalUnreadChatCount(userId) {
        const unreadCount = await this.chatService.getTotalUnreadChatCount(userId);
        return { unreadCount };
    }
    async getChatRoomsByProductId(productId) {
        return this.chatService.getChatRoomsByProductId(productId);
    }
    async getUserChatRoomsByProductId(userId, productId) {
        return this.chatService.getUserChatRoomsByProductId(userId, productId);
    }
    async getLastMessageByChatRoomId(chatRoomId) {
        return this.chatService.getLastMessageByChatRoomId(chatRoomId);
    }
    async generateChatRoomImageUploadUrl(userId, chatRoomId, dto) {
        return this.s3Service.generatePresignedUploadUrl(userId, {
            ...dto,
            chatRoomId,
        });
    }
    async getChatParticipants(chatRoomId) {
        return this.chatService.getChatParticipants(chatRoomId);
    }
    async updateChatRoomNotification(userId, chatRoomId, dto) {
        await this.chatService.updateChatRoomNotification(userId, chatRoomId, dto.isNotificationEnabled);
        return { message: '알림 설정이 변경되었습니다.' };
    }
};
exports.ChatController = ChatController;
__decorate([
    (0, common_1.Post)('room'),
    (0, common_1.UseInterceptors)(interceptor_1.TransactionInterceptor),
    (0, swagger_1.ApiOperation)({
        summary: '채팅방 생성/조회',
        description: '상품에 대한 채팅방을 생성하거나 기존 채팅방을 조회합니다.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: '채팅방 정보',
        type: dto_2.ChatRoomResponseDto,
    }),
    __param(0, (0, decorator_1.UserId)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, decorator_1.QueryRunner)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, dto_2.CreateChatRoomDto, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "createOrGetChatRoom", null);
__decorate([
    (0, common_1.Get)('room'),
    (0, swagger_1.ApiOperation)({
        summary: '내 채팅방 목록 조회',
        description: '내가 참여한 채팅방 목록을 조회합니다.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '채팅방 목록',
    }),
    __param(0, (0, decorator_1.UserId)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, dto_1.PagePaginationDto]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getMyChatRooms", null);
__decorate([
    (0, common_1.Get)('room/:id'),
    (0, swagger_1.ApiOperation)({
        summary: '채팅방 상세 조회',
        description: '채팅방 상세 정보를 조회합니다.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '채팅방 정보',
        type: dto_2.ChatRoomResponseDto,
    }),
    __param(0, (0, decorator_1.UserId)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getChatRoomById", null);
__decorate([
    (0, common_1.Get)('room/:id/messages'),
    (0, swagger_1.ApiOperation)({
        summary: '채팅 메시지 조회',
        description: '채팅방의 메시지를 조회합니다.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '메시지 목록',
    }),
    __param(0, (0, decorator_1.UserId)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, dto_2.GetChatMessagesDto]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getChatMessages", null);
__decorate([
    (0, common_1.Post)('room/:id/read'),
    (0, swagger_1.ApiOperation)({
        summary: '채팅방 읽음 처리',
        description: '채팅방의 메시지를 읽음 처리합니다.',
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: '읽음 처리 완료' }),
    __param(0, (0, decorator_1.UserId)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "markChatRoomAsRead", null);
__decorate([
    (0, common_1.Get)('unread-count'),
    (0, swagger_1.ApiOperation)({
        summary: '총 안읽은 메시지 수 조회',
        description: '모든 채팅방의 안읽은 메시지 총 수를 조회합니다.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '안읽은 메시지 수',
    }),
    __param(0, (0, decorator_1.UserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getTotalUnreadChatCount", null);
__decorate([
    (0, common_1.Get)('product/:productId/rooms'),
    (0, swagger_1.ApiOperation)({
        summary: '상품별 채팅방 목록 조회',
        description: '특정 상품에 대한 모든 채팅방을 조회합니다.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '채팅방 목록',
        type: [dto_2.ChatRoomResponseDto],
    }),
    __param(0, (0, common_1.Param)('productId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getChatRoomsByProductId", null);
__decorate([
    (0, common_1.Get)('product/:productId/my-rooms'),
    (0, swagger_1.ApiOperation)({
        summary: '내가 참여한 상품별 채팅방 조회',
        description: '특정 상품에 대해 내가 참여한 채팅방을 조회합니다.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '채팅방 목록',
        type: [dto_2.ChatRoomResponseDto],
    }),
    __param(0, (0, decorator_1.UserId)()),
    __param(1, (0, common_1.Param)('productId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getUserChatRoomsByProductId", null);
__decorate([
    (0, common_1.Get)('room/:id/last-message'),
    (0, swagger_1.ApiOperation)({
        summary: '채팅방 마지막 메시지 조회',
        description: '채팅방의 가장 최근 메시지를 조회합니다.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '마지막 메시지',
        type: dto_2.ChatMessageResponseDto,
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getLastMessageByChatRoomId", null);
__decorate([
    (0, common_1.Post)('room/:id/upload-url'),
    (0, swagger_1.ApiOperation)({
        summary: '채팅 이미지 업로드 URL 생성',
        description: '채팅방에서 사용할 이미지 업로드를 위한 presigned URL을 생성합니다.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Presigned URL 정보',
        type: dto_3.PresignedUrlResponseDto,
    }),
    __param(0, (0, decorator_1.UserId)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, dto_3.GeneratePresignedUrlDto]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "generateChatRoomImageUploadUrl", null);
__decorate([
    (0, common_1.Get)('room/:id/participants'),
    (0, swagger_1.ApiOperation)({
        summary: '채팅방 참여자 목록 조회',
        description: '채팅방의 모든 참여자 정보를 조회합니다.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '참여자 목록',
        type: [dto_2.ChatParticipantResponseDto],
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getChatParticipants", null);
__decorate([
    (0, common_1.Patch)('room/:id/notification'),
    (0, swagger_1.ApiOperation)({
        summary: '채팅방 알림 설정 변경',
        description: '채팅방의 알림 수신 여부를 변경합니다.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '알림 설정 변경 성공',
    }),
    __param(0, (0, decorator_1.UserId)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, dto_2.UpdateChatRoomNotificationDto]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "updateChatRoomNotification", null);
exports.ChatController = ChatController = __decorate([
    (0, common_1.Controller)('chat'),
    (0, swagger_1.ApiTags)('chat'),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [chat_service_1.ChatService,
        s3_service_1.S3Service])
], ChatController);
//# sourceMappingURL=chat.controller.js.map