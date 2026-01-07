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
exports.TransactionReview = exports.ReviewType = void 0;
const typeorm_1 = require("typeorm");
const base_table_entity_1 = require("../../common/entity/base-table.entity");
const user_entity_1 = require("../../user/entity/user.entity");
const product_entity_1 = require("../../product/entity/product.entity");
const chat_room_entity_1 = require("../../chat/entity/chat-room.entity");
var ReviewType;
(function (ReviewType) {
    ReviewType["buyer_to_seller"] = "buyer_to_seller";
    ReviewType["seller_to_buyer"] = "seller_to_buyer";
})(ReviewType || (exports.ReviewType = ReviewType = {}));
let TransactionReview = class TransactionReview extends base_table_entity_1.BaseTable {
    id;
    productId;
    product;
    chatRoomId;
    chatRoom;
    reviewerId;
    reviewer;
    revieweeId;
    reviewee;
    reviewType;
    rating;
    content;
};
exports.TransactionReview = TransactionReview;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], TransactionReview.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], TransactionReview.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_entity_1.Product, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'productId' }),
    __metadata("design:type", product_entity_1.Product)
], TransactionReview.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], TransactionReview.prototype, "chatRoomId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => chat_room_entity_1.ChatRoom, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'chatRoomId' }),
    __metadata("design:type", chat_room_entity_1.ChatRoom)
], TransactionReview.prototype, "chatRoom", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], TransactionReview.prototype, "reviewerId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'reviewerId' }),
    __metadata("design:type", user_entity_1.User)
], TransactionReview.prototype, "reviewer", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], TransactionReview.prototype, "revieweeId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'revieweeId' }),
    __metadata("design:type", user_entity_1.User)
], TransactionReview.prototype, "reviewee", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ReviewType }),
    __metadata("design:type", String)
], TransactionReview.prototype, "reviewType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], TransactionReview.prototype, "rating", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], TransactionReview.prototype, "content", void 0);
exports.TransactionReview = TransactionReview = __decorate([
    (0, typeorm_1.Entity)(),
    (0, typeorm_1.Unique)(['productId', 'chatRoomId', 'reviewerId', 'reviewType']),
    (0, typeorm_1.Index)(['productId']),
    (0, typeorm_1.Index)(['revieweeId']),
    (0, typeorm_1.Index)(['reviewerId']),
    (0, typeorm_1.Index)(['createdAt'])
], TransactionReview);
//# sourceMappingURL=transaction-review.entity.js.map