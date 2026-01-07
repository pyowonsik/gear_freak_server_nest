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
exports.UserStatsResponseDto = exports.UserResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class UserResponseDto {
    id;
    email;
    nickname;
    profileImageUrl;
    bio;
    createdAt;
}
exports.UserResponseDto = UserResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '사용자 ID' }),
    __metadata("design:type", Number)
], UserResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: '이메일' }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: '닉네임' }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "nickname", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: '프로필 이미지 URL' }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "profileImageUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: '자기소개' }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "bio", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '가입일' }),
    __metadata("design:type", Date)
], UserResponseDto.prototype, "createdAt", void 0);
class UserStatsResponseDto {
    sellingCount;
    soldCount;
    reviewCount;
    averageRating;
}
exports.UserStatsResponseDto = UserStatsResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '판매중인 상품 수' }),
    __metadata("design:type", Number)
], UserStatsResponseDto.prototype, "sellingCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '판매완료 상품 수' }),
    __metadata("design:type", Number)
], UserStatsResponseDto.prototype, "soldCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '받은 리뷰 수' }),
    __metadata("design:type", Number)
], UserStatsResponseDto.prototype, "reviewCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '평균 평점' }),
    __metadata("design:type", Number)
], UserStatsResponseDto.prototype, "averageRating", void 0);
//# sourceMappingURL=user-response.dto.js.map