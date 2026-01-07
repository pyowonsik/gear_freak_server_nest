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
exports.ReviewService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const transaction_review_entity_1 = require("./entity/transaction-review.entity");
const product_entity_1 = require("../product/entity/product.entity");
const dto_1 = require("../common/dto");
const notification_service_1 = require("../notification/notification.service");
const notification_entity_1 = require("../notification/entity/notification.entity");
let ReviewService = class ReviewService {
    reviewRepository;
    productRepository;
    notificationService;
    constructor(reviewRepository, productRepository, notificationService) {
        this.reviewRepository = reviewRepository;
        this.productRepository = productRepository;
        this.notificationService = notificationService;
    }
    async createReview(userId, dto, qr) {
        const repository = qr
            ? qr.manager.getRepository(transaction_review_entity_1.TransactionReview)
            : this.reviewRepository;
        const product = await this.productRepository.findOne({
            where: { id: dto.productId },
        });
        if (!product) {
            throw new common_1.NotFoundException('상품을 찾을 수 없습니다.');
        }
        const existingReview = await repository.findOne({
            where: {
                productId: dto.productId,
                reviewerId: userId,
                reviewType: dto.reviewType,
            },
        });
        if (existingReview) {
            throw new common_1.BadRequestException('이미 리뷰를 작성했습니다.');
        }
        if (userId === dto.revieweeId) {
            throw new common_1.BadRequestException('자신에게 리뷰를 작성할 수 없습니다.');
        }
        const review = repository.create({
            productId: dto.productId,
            chatRoomId: dto.chatRoomId,
            reviewerId: userId,
            revieweeId: dto.revieweeId,
            reviewType: dto.reviewType,
            rating: dto.rating,
            content: dto.content,
        });
        const savedReview = await repository.save(review);
        await this.notificationService.createNotification({
            userId: dto.revieweeId,
            type: notification_entity_1.NotificationType.review_received,
            title: '새 리뷰가 도착했습니다',
            body: dto.content || `${dto.rating}점 평가를 받았습니다.`,
            data: {
                reviewId: savedReview.id,
                productId: dto.productId,
            },
            referenceId: savedReview.id,
            referenceType: 'review',
        });
        return this.getReviewById(savedReview.id);
    }
    async getReviewById(reviewId) {
        const review = await this.reviewRepository.findOne({
            where: { id: reviewId },
            relations: ['reviewer', 'reviewee', 'product'],
        });
        if (!review) {
            throw new common_1.NotFoundException('리뷰를 찾을 수 없습니다.');
        }
        return this.toReviewResponse(review);
    }
    async getBuyerReviews(userId, page = 1, limit = 20) {
        const offset = (page - 1) * limit;
        const [reviews, total] = await this.reviewRepository.findAndCount({
            where: {
                revieweeId: userId,
                reviewType: transaction_review_entity_1.ReviewType.buyer_to_seller,
            },
            relations: ['reviewer', 'reviewee', 'product'],
            order: { createdAt: 'DESC' },
            skip: offset,
            take: limit,
        });
        const items = reviews.map((r) => this.toReviewResponse(r));
        return new dto_1.PaginationResponseDto(items, total, page, limit);
    }
    async getSellerReviews(userId, page = 1, limit = 20) {
        const offset = (page - 1) * limit;
        const [reviews, total] = await this.reviewRepository.findAndCount({
            where: {
                revieweeId: userId,
                reviewType: transaction_review_entity_1.ReviewType.seller_to_buyer,
            },
            relations: ['reviewer', 'reviewee', 'product'],
            order: { createdAt: 'DESC' },
            skip: offset,
            take: limit,
        });
        const items = reviews.map((r) => this.toReviewResponse(r));
        return new dto_1.PaginationResponseDto(items, total, page, limit);
    }
    async getAllReviewsByUserId(targetUserId, page = 1, limit = 20) {
        const offset = (page - 1) * limit;
        const [reviews, total] = await this.reviewRepository.findAndCount({
            where: { revieweeId: targetUserId },
            relations: ['reviewer', 'reviewee', 'product'],
            order: { createdAt: 'DESC' },
            skip: offset,
            take: limit,
        });
        const items = reviews.map((r) => this.toReviewResponse(r));
        return new dto_1.PaginationResponseDto(items, total, page, limit);
    }
    async checkReviewExists(userId, dto) {
        const review = await this.reviewRepository.findOne({
            where: {
                productId: dto.productId,
                reviewerId: userId,
                revieweeId: dto.revieweeId,
                reviewType: dto.reviewType,
            },
        });
        return !!review;
    }
    async getUserReviewStats(userId) {
        const result = await this.reviewRepository
            .createQueryBuilder('review')
            .select('COUNT(*)', 'count')
            .addSelect('AVG(review.rating)', 'average')
            .where('review.revieweeId = :userId', { userId })
            .getRawOne();
        return {
            reviewCount: parseInt(result.count, 10) || 0,
            averageRating: parseFloat(result.average) || 0,
        };
    }
    toReviewResponse(review) {
        return {
            id: review.id,
            productId: review.productId,
            productTitle: review.product?.title,
            reviewType: review.reviewType,
            rating: review.rating,
            content: review.content,
            createdAt: review.createdAt,
            reviewer: {
                id: review.reviewer?.id,
                nickname: review.reviewer?.nickname,
                profileImageUrl: review.reviewer?.profileImageUrl,
            },
            reviewee: {
                id: review.reviewee?.id,
                nickname: review.reviewee?.nickname,
                profileImageUrl: review.reviewee?.profileImageUrl,
            },
        };
    }
};
exports.ReviewService = ReviewService;
exports.ReviewService = ReviewService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(transaction_review_entity_1.TransactionReview)),
    __param(1, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        notification_service_1.NotificationService])
], ReviewService);
//# sourceMappingURL=review.service.js.map