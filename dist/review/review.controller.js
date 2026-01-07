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
exports.ReviewController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const review_service_1 = require("./review.service");
const decorator_1 = require("../common/decorator");
const interceptor_1 = require("../common/interceptor");
const dto_1 = require("../common/dto");
const dto_2 = require("./dto");
let ReviewController = class ReviewController {
    reviewService;
    constructor(reviewService) {
        this.reviewService = reviewService;
    }
    async createReview(userId, dto, qr) {
        return this.reviewService.createReview(userId, dto, qr);
    }
    async getBuyerReviews(userId, dto) {
        return this.reviewService.getBuyerReviews(userId, dto.page, dto.limit);
    }
    async getSellerReviews(userId, dto) {
        return this.reviewService.getSellerReviews(userId, dto.page, dto.limit);
    }
    async getAllReviewsByUserId(targetUserId, dto) {
        return this.reviewService.getAllReviewsByUserId(targetUserId, dto.page, dto.limit);
    }
    async checkReviewExists(userId, dto) {
        const exists = await this.reviewService.checkReviewExists(userId, dto);
        return { exists };
    }
    async getMyReviewStats(userId) {
        return this.reviewService.getUserReviewStats(userId);
    }
};
exports.ReviewController = ReviewController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)(interceptor_1.TransactionInterceptor),
    (0, swagger_1.ApiOperation)({
        summary: '리뷰 작성',
        description: '거래 리뷰를 작성합니다.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: '리뷰 작성 성공',
        type: dto_2.ReviewResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: '이미 리뷰를 작성함' }),
    __param(0, (0, decorator_1.UserId)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, decorator_1.QueryRunner)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, dto_2.CreateReviewDto, Object]),
    __metadata("design:returntype", Promise)
], ReviewController.prototype, "createReview", null);
__decorate([
    (0, common_1.Get)('buyer'),
    (0, swagger_1.ApiOperation)({
        summary: '구매자로부터 받은 리뷰 조회',
        description: '판매자로서 받은 리뷰 목록을 조회합니다.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '리뷰 목록',
    }),
    __param(0, (0, decorator_1.UserId)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, dto_1.PagePaginationDto]),
    __metadata("design:returntype", Promise)
], ReviewController.prototype, "getBuyerReviews", null);
__decorate([
    (0, common_1.Get)('seller'),
    (0, swagger_1.ApiOperation)({
        summary: '판매자로부터 받은 리뷰 조회',
        description: '구매자로서 받은 리뷰 목록을 조회합니다.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '리뷰 목록',
    }),
    __param(0, (0, decorator_1.UserId)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, dto_1.PagePaginationDto]),
    __metadata("design:returntype", Promise)
], ReviewController.prototype, "getSellerReviews", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    (0, swagger_1.ApiOperation)({
        summary: '특정 사용자의 리뷰 조회',
        description: '특정 사용자가 받은 리뷰 목록을 조회합니다.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '리뷰 목록',
    }),
    __param(0, (0, common_1.Param)('userId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, dto_1.PagePaginationDto]),
    __metadata("design:returntype", Promise)
], ReviewController.prototype, "getAllReviewsByUserId", null);
__decorate([
    (0, common_1.Post)('exists'),
    (0, swagger_1.ApiOperation)({
        summary: '리뷰 존재 여부 확인',
        description: '특정 조건의 리뷰가 존재하는지 확인합니다.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: '리뷰 존재 여부',
    }),
    __param(0, (0, decorator_1.UserId)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, dto_2.CheckReviewExistsDto]),
    __metadata("design:returntype", Promise)
], ReviewController.prototype, "checkReviewExists", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, swagger_1.ApiOperation)({
        summary: '내 리뷰 통계 조회',
        description: '내가 받은 리뷰 통계를 조회합니다.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '리뷰 통계',
    }),
    __param(0, (0, decorator_1.UserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ReviewController.prototype, "getMyReviewStats", null);
exports.ReviewController = ReviewController = __decorate([
    (0, common_1.Controller)('review'),
    (0, swagger_1.ApiTags)('review'),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [review_service_1.ReviewService])
], ReviewController);
//# sourceMappingURL=review.controller.js.map