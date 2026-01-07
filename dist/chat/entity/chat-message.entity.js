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
exports.ChatMessage = exports.MessageType = void 0;
const typeorm_1 = require("typeorm");
const base_table_entity_1 = require("../../common/entity/base-table.entity");
const user_entity_1 = require("../../user/entity/user.entity");
const chat_room_entity_1 = require("./chat-room.entity");
var MessageType;
(function (MessageType) {
    MessageType["text"] = "text";
    MessageType["image"] = "image";
    MessageType["file"] = "file";
    MessageType["system"] = "system";
})(MessageType || (exports.MessageType = MessageType = {}));
let ChatMessage = class ChatMessage extends base_table_entity_1.BaseTable {
    id;
    chatRoomId;
    chatRoom;
    senderId;
    sender;
    messageType;
    content;
    attachmentUrl;
    attachmentName;
    attachmentSize;
};
exports.ChatMessage = ChatMessage;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ChatMessage.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], ChatMessage.prototype, "chatRoomId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => chat_room_entity_1.ChatRoom, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'chatRoomId' }),
    __metadata("design:type", chat_room_entity_1.ChatRoom)
], ChatMessage.prototype, "chatRoom", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], ChatMessage.prototype, "senderId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'senderId' }),
    __metadata("design:type", user_entity_1.User)
], ChatMessage.prototype, "sender", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: MessageType, default: MessageType.text }),
    __metadata("design:type", String)
], ChatMessage.prototype, "messageType", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], ChatMessage.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ChatMessage.prototype, "attachmentUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ChatMessage.prototype, "attachmentName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], ChatMessage.prototype, "attachmentSize", void 0);
exports.ChatMessage = ChatMessage = __decorate([
    (0, typeorm_1.Entity)(),
    (0, typeorm_1.Index)(['chatRoomId', 'createdAt']),
    (0, typeorm_1.Index)(['senderId', 'createdAt']),
    (0, typeorm_1.Index)(['messageType'])
], ChatMessage);
//# sourceMappingURL=chat-message.entity.js.map