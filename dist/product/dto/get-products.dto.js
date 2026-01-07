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
exports.GetProductsDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const dto_1 = require("../../common/dto");
const product_entity_1 = require("../entity/product.entity");
class GetProductsDto extends dto_1.PagePaginationDto {
    category;
    status;
    search;
}
exports.GetProductsDto = GetProductsDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: '카테고리 필터',
        enum: product_entity_1.ProductCategory,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(product_entity_1.ProductCategory),
    __metadata("design:type", String)
], GetProductsDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: '상태 필터',
        enum: product_entity_1.ProductStatus,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(product_entity_1.ProductStatus),
    __metadata("design:type", String)
], GetProductsDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: '검색어',
        example: '러닝화',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetProductsDto.prototype, "search", void 0);
//# sourceMappingURL=get-products.dto.js.map