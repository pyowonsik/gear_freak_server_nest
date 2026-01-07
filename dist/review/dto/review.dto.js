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
exports.CheckReviewExistsDto = exports.ReviewResponseDto = exports.CreateReviewDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const transaction_review_entity_1 = require("../entity/transaction-review.entity");
class CreateReviewDto {
    productId;
    chatRoomId;
    revieweeId;
    reviewType;
    rating;
    content;
}
exports.CreateReviewDto = CreateReviewDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '상품 ID' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreateReviewDto.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: '채팅방 ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateReviewDto.prototype, "chatRoomId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '리뷰 대상자 ID' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreateReviewDto.prototype, "revieweeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '리뷰 타입',
        enum: transaction_review_entity_1.ReviewType,
    }),
    (0, class_validator_1.IsEnum)(transaction_review_entity_1.ReviewType),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateReviewDto.prototype, "reviewType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '평점 (1-5)',
        minimum: 1,
        maximum: 5,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(5),
    __metadata("design:type", Number)
], CreateReviewDto.prototype, "rating", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: '리뷰 내용',
        maxLength: 500,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], CreateReviewDto.prototype, "content", void 0);
class ReviewResponseDto {
    id;
    productId;
    productTitle;
    reviewType;
    rating;
    content;
    createdAt;
    reviewer;
    reviewee;
}
exports.ReviewResponseDto = ReviewResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ReviewResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ReviewResponseDto.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], ReviewResponseDto.prototype, "productTitle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: transaction_review_entity_1.ReviewType }),
    __metadata("design:type", String)
], ReviewResponseDto.prototype, "reviewType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ReviewResponseDto.prototype, "rating", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], ReviewResponseDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], ReviewResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], ReviewResponseDto.prototype, "reviewer", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], ReviewResponseDto.prototype, "reviewee", void 0);
class CheckReviewExistsDto {
    productId;
    revieweeId;
    reviewType;
}
exports.CheckReviewExistsDto = CheckReviewExistsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '상품 ID' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CheckReviewExistsDto.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '리뷰 대상자 ID' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CheckReviewExistsDto.prototype, "revieweeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '리뷰 타입',
        enum: transaction_review_entity_1.ReviewType,
    }),
    (0, class_validator_1.IsEnum)(transaction_review_entity_1.ReviewType),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CheckReviewExistsDto.prototype, "reviewType", void 0);
//# sourceMappingURL=review.dto.js.map