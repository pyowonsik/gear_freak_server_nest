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
exports.UpdateProductStatusDto = exports.UpdateProductDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const product_entity_1 = require("../entity/product.entity");
class UpdateProductDto {
    title;
    category;
    price;
    condition;
    description;
    tradeMethod;
    baseAddress;
    detailAddress;
    imageUrls;
}
exports.UpdateProductDto = UpdateProductDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: '상품 제목',
        example: '러닝화 나이키 에어줌 페가수스',
        maxLength: 100,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], UpdateProductDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: '상품 카테고리',
        enum: product_entity_1.ProductCategory,
        example: product_entity_1.ProductCategory.equipment,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(product_entity_1.ProductCategory),
    __metadata("design:type", String)
], UpdateProductDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: '상품 가격',
        example: 50000,
        minimum: 0,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateProductDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: '상품 상태',
        enum: product_entity_1.ProductCondition,
        example: product_entity_1.ProductCondition.usedGood,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(product_entity_1.ProductCondition),
    __metadata("design:type", String)
], UpdateProductDto.prototype, "condition", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: '상품 설명',
        example: '한 달 정도 사용한 러닝화입니다. 상태 좋습니다.',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProductDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: '거래 방법',
        enum: product_entity_1.TradeMethod,
        example: product_entity_1.TradeMethod.both,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(product_entity_1.TradeMethod),
    __metadata("design:type", String)
], UpdateProductDto.prototype, "tradeMethod", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: '거래 지역 (기본 주소)',
        example: '서울시 강남구',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProductDto.prototype, "baseAddress", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: '거래 지역 (상세 주소)',
        example: '역삼동 123-45',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProductDto.prototype, "detailAddress", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: '상품 이미지 URL 목록',
        example: ['https://s3.../image1.jpg', 'https://s3.../image2.jpg'],
        type: [String],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpdateProductDto.prototype, "imageUrls", void 0);
class UpdateProductStatusDto {
    status;
}
exports.UpdateProductStatusDto = UpdateProductStatusDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: '상품 판매 상태',
        enum: product_entity_1.ProductStatus,
        example: product_entity_1.ProductStatus.sold,
    }),
    (0, class_validator_1.IsEnum)(product_entity_1.ProductStatus),
    __metadata("design:type", String)
], UpdateProductStatusDto.prototype, "status", void 0);
//# sourceMappingURL=update-product.dto.js.map