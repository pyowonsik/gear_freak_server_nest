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
exports.DeleteFileDto = exports.PresignedUrlResponseDto = exports.GeneratePresignedUrlDto = exports.FileCategory = exports.BucketType = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var BucketType;
(function (BucketType) {
    BucketType["public"] = "public";
    BucketType["private"] = "private";
})(BucketType || (exports.BucketType = BucketType = {}));
var FileCategory;
(function (FileCategory) {
    FileCategory["product"] = "product";
    FileCategory["profile"] = "profile";
    FileCategory["chatRoom"] = "chatRoom";
})(FileCategory || (exports.FileCategory = FileCategory = {}));
class GeneratePresignedUrlDto {
    bucketType;
    fileCategory;
    fileName;
    contentType;
    productId;
    chatRoomId;
}
exports.GeneratePresignedUrlDto = GeneratePresignedUrlDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '버킷 타입',
        enum: BucketType,
        example: BucketType.public,
    }),
    (0, class_validator_1.IsEnum)(BucketType),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], GeneratePresignedUrlDto.prototype, "bucketType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '파일 카테고리',
        enum: FileCategory,
        example: FileCategory.product,
    }),
    (0, class_validator_1.IsEnum)(FileCategory),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], GeneratePresignedUrlDto.prototype, "fileCategory", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '파일명 (확장자 포함)',
        example: 'image.jpg',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], GeneratePresignedUrlDto.prototype, "fileName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '파일 Content-Type',
        example: 'image/jpeg',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], GeneratePresignedUrlDto.prototype, "contentType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: '상품 ID (product 카테고리일 때)',
        example: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], GeneratePresignedUrlDto.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: '채팅방 ID (chatRoom 카테고리일 때)',
        example: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], GeneratePresignedUrlDto.prototype, "chatRoomId", void 0);
class PresignedUrlResponseDto {
    uploadUrl;
    fileUrl;
    fileKey;
}
exports.PresignedUrlResponseDto = PresignedUrlResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '업로드용 Presigned URL' }),
    __metadata("design:type", String)
], PresignedUrlResponseDto.prototype, "uploadUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '업로드 후 파일 접근 URL' }),
    __metadata("design:type", String)
], PresignedUrlResponseDto.prototype, "fileUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '파일 키 (S3 path)' }),
    __metadata("design:type", String)
], PresignedUrlResponseDto.prototype, "fileKey", void 0);
class DeleteFileDto {
    bucketType;
    fileKey;
}
exports.DeleteFileDto = DeleteFileDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '버킷 타입',
        enum: BucketType,
        example: BucketType.public,
    }),
    (0, class_validator_1.IsEnum)(BucketType),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], DeleteFileDto.prototype, "bucketType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '삭제할 파일 키',
        example: 'product/1/image.jpg',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], DeleteFileDto.prototype, "fileKey", void 0);
//# sourceMappingURL=presigned-url.dto.js.map