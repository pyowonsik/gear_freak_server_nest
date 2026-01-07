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
exports.ChatRoom = exports.ChatRoomType = void 0;
const typeorm_1 = require("typeorm");
const base_table_entity_1 = require("../../common/entity/base-table.entity");
const product_entity_1 = require("../../product/entity/product.entity");
var ChatRoomType;
(function (ChatRoomType) {
    ChatRoomType["direct"] = "direct";
    ChatRoomType["group"] = "group";
})(ChatRoomType || (exports.ChatRoomType = ChatRoomType = {}));
let ChatRoom = class ChatRoom extends base_table_entity_1.BaseTable {
    id;
    productId;
    product;
    title;
    chatRoomType;
    participantCount;
    lastActivityAt;
};
exports.ChatRoom = ChatRoom;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ChatRoom.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], ChatRoom.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_entity_1.Product, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'productId' }),
    __metadata("design:type", product_entity_1.Product)
], ChatRoom.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ChatRoom.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ChatRoomType, default: ChatRoomType.direct }),
    __metadata("design:type", String)
], ChatRoom.prototype, "chatRoomType", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], ChatRoom.prototype, "participantCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], ChatRoom.prototype, "lastActivityAt", void 0);
exports.ChatRoom = ChatRoom = __decorate([
    (0, typeorm_1.Entity)(),
    (0, typeorm_1.Index)(['productId']),
    (0, typeorm_1.Index)(['lastActivityAt']),
    (0, typeorm_1.Index)(['chatRoomType'])
], ChatRoom);
//# sourceMappingURL=chat-room.entity.js.map