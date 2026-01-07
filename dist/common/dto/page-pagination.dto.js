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
exports.PaginationResponseDto = exports.PagePaginationDto = exports.SortBy = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var SortBy;
(function (SortBy) {
    SortBy["latest"] = "latest";
    SortBy["oldest"] = "oldest";
    SortBy["priceAsc"] = "priceAsc";
    SortBy["priceDesc"] = "priceDesc";
    SortBy["popular"] = "popular";
})(SortBy || (exports.SortBy = SortBy = {}));
class PagePaginationDto {
    page = 1;
    limit = 20;
    sortBy = SortBy.latest;
    get offset() {
        return ((this.page || 1) - 1) * (this.limit || 20);
    }
}
exports.PagePaginationDto = PagePaginationDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: '페이지 번호 (1부터 시작)', default: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], PagePaginationDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: '페이지당 아이템 수', default: 20 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], PagePaginationDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: '정렬 기준', enum: SortBy, default: SortBy.latest }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(SortBy),
    __metadata("design:type", String)
], PagePaginationDto.prototype, "sortBy", void 0);
class PaginationResponseDto {
    items;
    pagination;
    constructor(items, total, page, limit) {
        this.items = items;
        this.pagination = {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            hasMore: page * limit < total,
        };
    }
}
exports.PaginationResponseDto = PaginationResponseDto;
//# sourceMappingURL=page-pagination.dto.js.map