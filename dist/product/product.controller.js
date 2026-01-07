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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const product_service_1 = require("./product.service");
const decorator_1 = require("../common/decorator");
const interceptor_1 = require("../common/interceptor");
const dto_1 = require("./dto");
let ProductController = class ProductController {
    productService;
    constructor(productService) {
        this.productService = productService;
    }
    async createProduct(userId, dto, qr) {
        return this.productService.createProduct(userId, dto, qr);
    }
    async getProducts(dto, userId) {
        return this.productService.getProducts(dto, userId);
    }
    async getMyProducts(userId, dto) {
        return this.productService.getMyProducts(userId, dto);
    }
    async getMyFavoriteProducts(userId, dto) {
        return this.productService.getMyFavoriteProducts(userId, dto);
    }
    async getProductStats(userId) {
        return this.productService.getProductStats(userId);
    }
    async getProductsByUserId(targetUserId, dto) {
        return this.productService.getProductsByUserId(targetUserId, dto);
    }
    async getProductById(productId, userId) {
        return this.productService.getProductById(productId, userId);
    }
    async updateProduct(userId, productId, dto, qr) {
        return this.productService.updateProduct(userId, productId, dto, qr);
    }
    async deleteProduct(userId, productId, qr) {
        await this.productService.deleteProduct(userId, productId, qr);
        return { message: '상품이 삭제되었습니다.' };
    }
    async toggleFavorite(userId, productId) {
        return this.productService.toggleFavorite(userId, productId);
    }
    async isFavorite(userId, productId) {
        const isFavorite = await this.productService.isFavorite(userId, productId);
        return { isFavorite };
    }
    async incrementViewCount(userId, productId) {
        await this.productService.incrementViewCount(userId, productId);
        return { message: '조회수가 증가되었습니다.' };
    }
    async updateProductStatus(userId, productId, dto, qr) {
        return this.productService.updateProductStatus(userId, productId, dto, qr);
    }
    async bumpProduct(userId, productId) {
        await this.productService.bumpProduct(userId, productId);
        return { message: '상품이 끌어올려졌습니다.' };
    }
    async hasReportedProduct(userId, productId) {
        const hasReported = await this.productService.hasReportedProduct(userId, productId);
        return { hasReported };
    }
    async createProductReport(userId, productId, dto) {
        await this.productService.createProductReport(userId, productId, dto);
        return { message: '상품이 신고되었습니다.' };
    }
    async getUserProductStats(userId) {
        return this.productService.getUserProductStats(userId);
    }
};
exports.ProductController = ProductController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)(interceptor_1.TransactionInterceptor),
    (0, swagger_1.ApiOperation)({
        summary: '상품 등록',
        description: '새로운 상품을 등록합니다.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: '상품 등록 성공',
        type: dto_1.ProductResponseDto,
    }),
    __param(0, (0, decorator_1.UserId)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, decorator_1.QueryRunner)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, dto_1.CreateProductDto, Object]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "createProduct", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: '상품 목록 조회',
        description: '상품 목록을 페이지네이션, 필터링, 정렬하여 조회합니다.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '상품 목록',
    }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, decorator_1.UserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.GetProductsDto, Number]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getProducts", null);
__decorate([
    (0, common_1.Get)('my'),
    (0, swagger_1.ApiOperation)({
        summary: '내 상품 목록 조회',
        description: '내가 등록한 상품 목록을 조회합니다.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '내 상품 목록',
    }),
    __param(0, (0, decorator_1.UserId)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, dto_1.GetProductsDto]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getMyProducts", null);
__decorate([
    (0, common_1.Get)('favorites'),
    (0, swagger_1.ApiOperation)({
        summary: '찜한 상품 목록 조회',
        description: '내가 찜한 상품 목록을 조회합니다.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '찜한 상품 목록',
    }),
    __param(0, (0, decorator_1.UserId)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, dto_1.GetProductsDto]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getMyFavoriteProducts", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, swagger_1.ApiOperation)({
        summary: '내 상품 통계 조회',
        description: '내 상품 판매 통계를 조회합니다.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '상품 통계',
        type: dto_1.ProductStatsDto,
    }),
    __param(0, (0, decorator_1.UserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getProductStats", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    (0, swagger_1.ApiOperation)({
        summary: '특정 사용자의 상품 목록 조회',
        description: '특정 사용자가 등록한 상품 목록을 조회합니다.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '사용자의 상품 목록',
    }),
    __param(0, (0, common_1.Param)('userId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, dto_1.GetProductsDto]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getProductsByUserId", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: '상품 상세 조회',
        description: '상품 상세 정보를 조회합니다.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '상품 상세 정보',
        type: dto_1.ProductResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: '상품을 찾을 수 없음' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, decorator_1.UserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getProductById", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseInterceptors)(interceptor_1.TransactionInterceptor),
    (0, swagger_1.ApiOperation)({
        summary: '상품 수정',
        description: '상품 정보를 수정합니다.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '수정된 상품 정보',
        type: dto_1.ProductResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 403, description: '권한 없음' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: '상품을 찾을 수 없음' }),
    __param(0, (0, decorator_1.UserId)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, decorator_1.QueryRunner)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, dto_1.UpdateProductDto, Object]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "updateProduct", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseInterceptors)(interceptor_1.TransactionInterceptor),
    (0, swagger_1.ApiOperation)({
        summary: '상품 삭제',
        description: '상품을 삭제합니다.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '삭제 완료' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: '권한 없음' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: '상품을 찾을 수 없음' }),
    __param(0, (0, decorator_1.UserId)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(2, (0, decorator_1.QueryRunner)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "deleteProduct", null);
__decorate([
    (0, common_1.Post)(':id/favorite'),
    (0, swagger_1.ApiOperation)({
        summary: '찜하기 토글',
        description: '상품 찜하기를 토글합니다.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: '찜하기 토글 결과',
    }),
    __param(0, (0, decorator_1.UserId)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "toggleFavorite", null);
__decorate([
    (0, common_1.Get)(':id/favorite'),
    (0, swagger_1.ApiOperation)({
        summary: '찜 여부 확인',
        description: '상품 찜 여부를 확인합니다.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '찜 여부',
    }),
    __param(0, (0, decorator_1.UserId)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "isFavorite", null);
__decorate([
    (0, common_1.Post)(':id/view'),
    (0, swagger_1.ApiOperation)({
        summary: '조회수 증가',
        description: '상품 조회수를 증가시킵니다 (사용자당 1회).',
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: '조회수 증가 성공' }),
    __param(0, (0, decorator_1.UserId)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "incrementViewCount", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, common_1.UseInterceptors)(interceptor_1.TransactionInterceptor),
    (0, swagger_1.ApiOperation)({
        summary: '상품 상태 변경',
        description: '상품 판매 상태를 변경합니다.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '변경된 상품 정보',
        type: dto_1.ProductResponseDto,
    }),
    __param(0, (0, decorator_1.UserId)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, decorator_1.QueryRunner)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, dto_1.UpdateProductStatusDto, Object]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "updateProductStatus", null);
__decorate([
    (0, common_1.Patch)(':id/bump'),
    (0, swagger_1.ApiOperation)({
        summary: '상품 끌어올리기',
        description: '상품을 목록 상단으로 끌어올립니다.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '끌어올리기 성공' }),
    __param(0, (0, decorator_1.UserId)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "bumpProduct", null);
__decorate([
    (0, common_1.Get)(':id/report'),
    (0, swagger_1.ApiOperation)({
        summary: '신고 여부 확인',
        description: '상품 신고 여부를 확인합니다.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '신고 여부',
    }),
    __param(0, (0, decorator_1.UserId)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "hasReportedProduct", null);
__decorate([
    (0, common_1.Post)(':id/report'),
    (0, swagger_1.ApiOperation)({
        summary: '상품 신고',
        description: '상품을 신고합니다.',
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: '신고 성공' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: '이미 신고한 상품' }),
    __param(0, (0, decorator_1.UserId)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, dto_1.CreateProductReportDto]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "createProductReport", null);
__decorate([
    (0, common_1.Get)('stats/:userId'),
    (0, swagger_1.ApiOperation)({
        summary: '사용자 상품 통계 조회',
        description: '특정 사용자의 상품 통계를 조회합니다.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '상품 통계',
    }),
    __param(0, (0, common_1.Param)('userId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getUserProductStats", null);
exports.ProductController = ProductController = __decorate([
    (0, common_1.Controller)('product'),
    (0, swagger_1.ApiTags)('product'),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [product_service_1.ProductService])
], ProductController);
//# sourceMappingURL=product.controller.js.map