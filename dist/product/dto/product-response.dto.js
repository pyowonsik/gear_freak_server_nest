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
exports.ProductStatsDto = exports.ProductListItemDto = exports.ProductResponseDto = exports.ProductSellerDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const product_entity_1 = require("../entity/product.entity");
class ProductSellerDto {
    id;
    nickname;
    profileImageUrl;
}
exports.ProductSellerDto = ProductSellerDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ProductSellerDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], ProductSellerDto.prototype, "nickname", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], ProductSellerDto.prototype, "profileImageUrl", void 0);
class ProductResponseDto {
    id;
    title;
    category;
    price;
    condition;
    description;
    tradeMethod;
    baseAddress;
    detailAddress;
    imageUrls;
    viewCount;
    favoriteCount;
    chatCount;
    status;
    createdAt;
    updatedAt;
    seller;
    isFavorite;
}
exports.ProductResponseDto = ProductResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ProductResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProductResponseDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: product_entity_1.ProductCategory }),
    __metadata("design:type", String)
], ProductResponseDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ProductResponseDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: product_entity_1.ProductCondition }),
    __metadata("design:type", String)
], ProductResponseDto.prototype, "condition", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProductResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: product_entity_1.TradeMethod }),
    __metadata("design:type", String)
], ProductResponseDto.prototype, "tradeMethod", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], ProductResponseDto.prototype, "baseAddress", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], ProductResponseDto.prototype, "detailAddress", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String] }),
    __metadata("design:type", Array)
], ProductResponseDto.prototype, "imageUrls", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ProductResponseDto.prototype, "viewCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ProductResponseDto.prototype, "favoriteCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ProductResponseDto.prototype, "chatCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: product_entity_1.ProductStatus }),
    __metadata("design:type", String)
], ProductResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], ProductResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], ProductResponseDto.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: ProductSellerDto }),
    __metadata("design:type", ProductSellerDto)
], ProductResponseDto.prototype, "seller", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: '현재 사용자의 찜 여부' }),
    __metadata("design:type", Boolean)
], ProductResponseDto.prototype, "isFavorite", void 0);
class ProductListItemDto {
    id;
    title;
    category;
    price;
    status;
    thumbnailUrl;
    favoriteCount;
    chatCount;
    createdAt;
    isFavorite;
}
exports.ProductListItemDto = ProductListItemDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ProductListItemDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProductListItemDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: product_entity_1.ProductCategory }),
    __metadata("design:type", String)
], ProductListItemDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ProductListItemDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: product_entity_1.ProductStatus }),
    __metadata("design:type", String)
], ProductListItemDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], ProductListItemDto.prototype, "thumbnailUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ProductListItemDto.prototype, "favoriteCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ProductListItemDto.prototype, "chatCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], ProductListItemDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: '현재 사용자의 찜 여부' }),
    __metadata("design:type", Boolean)
], ProductListItemDto.prototype, "isFavorite", void 0);
class ProductStatsDto {
    sellingCount;
    soldCount;
    reviewCount;
    averageRating;
}
exports.ProductStatsDto = ProductStatsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '판매중 상품 수' }),
    __metadata("design:type", Number)
], ProductStatsDto.prototype, "sellingCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '판매완료 상품 수' }),
    __metadata("design:type", Number)
], ProductStatsDto.prototype, "soldCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '받은 리뷰 수' }),
    __metadata("design:type", Number)
], ProductStatsDto.prototype, "reviewCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '평균 평점' }),
    __metadata("design:type", Number)
], ProductStatsDto.prototype, "averageRating", void 0);
//# sourceMappingURL=product-response.dto.js.map