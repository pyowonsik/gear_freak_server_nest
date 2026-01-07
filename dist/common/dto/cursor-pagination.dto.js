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
exports.CursorPaginationResponseDto = exports.CursorPaginationDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CursorPaginationDto {
    cursor;
    limit = 20;
}
exports.CursorPaginationDto = CursorPaginationDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: '커서 (마지막 아이템의 ID)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CursorPaginationDto.prototype, "cursor", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: '가져올 아이템 수', default: 20 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], CursorPaginationDto.prototype, "limit", void 0);
class CursorPaginationResponseDto {
    items;
    pagination;
    constructor(items, limit, hasMore) {
        this.items = items;
        this.pagination = {
            cursor: items.length > 0 ? items[items.length - 1].id : null,
            limit,
            hasMore,
        };
    }
}
exports.CursorPaginationResponseDto = CursorPaginationResponseDto;
//# sourceMappingURL=cursor-pagination.dto.js.map