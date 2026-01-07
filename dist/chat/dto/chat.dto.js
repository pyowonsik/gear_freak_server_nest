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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateChatRoomNotificationDto = exports.ChatParticipantResponseDto = exports.ChatMessageResponseDto = exports.ChatRoomResponseDto = exports.GetChatMessagesDto = exports.SendMessageDto = exports.CreateChatRoomDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const chat_message_entity_1 = require("../entity/chat-message.entity");
const dto_1 = require("../../common/dto");
class CreateChatRoomDto {
    productId;
    sellerId;
}
exports.CreateChatRoomDto = CreateChatRoomDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '상품 ID' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreateChatRoomDto.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '판매자 ID' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreateChatRoomDto.prototype, "sellerId", void 0);
class SendMessageDto {
    chatRoomId;
    content;
    messageType;
    attachmentUrl;
    attachmentName;
    attachmentSize;
}
exports.SendMessageDto = SendMessageDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '채팅방 ID' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], SendMessageDto.prototype, "chatRoomId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: '메시지 내용' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendMessageDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '메시지 타입',
        enum: chat_message_entity_1.MessageType,
        default: chat_message_entity_1.MessageType.text,
    }),
    (0, class_validator_1.IsEnum)(chat_message_entity_1.MessageType),
    __metadata("design:type", String)
], SendMessageDto.prototype, "messageType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: '첨부 파일 URL' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendMessageDto.prototype, "attachmentUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: '첨부 파일 이름' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendMessageDto.prototype, "attachmentName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: '첨부 파일 크기 (bytes)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SendMessageDto.prototype, "attachmentSize", void 0);
class GetChatMessagesDto extends dto_1.CursorPaginationDto {
}
exports.GetChatMessagesDto = GetChatMessagesDto;
class ChatRoomResponseDto {
    id;
    productId;
    productTitle;
    productThumbnail;
    otherUser;
    lastMessage;
    unreadCount;
    lastActivityAt;
}
exports.ChatRoomResponseDto = ChatRoomResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ChatRoomResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ChatRoomResponseDto.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ChatRoomResponseDto.prototype, "productTitle", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], ChatRoomResponseDto.prototype, "productThumbnail", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], ChatRoomResponseDto.prototype, "otherUser", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], ChatRoomResponseDto.prototype, "lastMessage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ChatRoomResponseDto.prototype, "unreadCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], ChatRoomResponseDto.prototype, "lastActivityAt", void 0);
class ChatMessageResponseDto {
    id;
    chatRoomId;
    senderId;
    messageType;
    content;
    attachmentUrl;
    attachmentName;
    attachmentSize;
    createdAt;
    sender;
}
exports.ChatMessageResponseDto = ChatMessageResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ChatMessageResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ChatMessageResponseDto.prototype, "chatRoomId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ChatMessageResponseDto.prototype, "senderId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: chat_message_entity_1.MessageType }),
    __metadata("design:type", String)
], ChatMessageResponseDto.prototype, "messageType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], ChatMessageResponseDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], ChatMessageResponseDto.prototype, "attachmentUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], ChatMessageResponseDto.prototype, "attachmentName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Number)
], ChatMessageResponseDto.prototype, "attachmentSize", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], ChatMessageResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], ChatMessageResponseDto.prototype, "sender", void 0);
class ChatParticipantResponseDto {
    userId;
    user;
    isActive;
    isNotificationEnabled;
    joinedAt;
    lastReadMessageId;
}
exports.ChatParticipantResponseDto = ChatParticipantResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ChatParticipantResponseDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], ChatParticipantResponseDto.prototype, "user", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], ChatParticipantResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], ChatParticipantResponseDto.prototype, "isNotificationEnabled", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], ChatParticipantResponseDto.prototype, "joinedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Number)
], ChatParticipantResponseDto.prototype, "lastReadMessageId", void 0);
class UpdateChatRoomNotificationDto {
    isNotificationEnabled;
}
exports.UpdateChatRoomNotificationDto = UpdateChatRoomNotificationDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '알림 활성화 여부' }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Boolean)
], UpdateChatRoomNotificationDto.prototype, "isNotificationEnabled", void 0);
//# sourceMappingURL=chat.dto.js.map