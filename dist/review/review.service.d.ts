import { Repository, QueryRunner } from 'typeorm';
import { TransactionReview } from './entity/transaction-review.entity';
import { Product } from '../product/entity/product.entity';
import { CreateReviewDto, ReviewResponseDto, CheckReviewExistsDto } from './dto';
import { PaginationResponseDto } from '../common/dto';
import { NotificationService } from '../notification/notification.service';
export declare class ReviewService {
    private readonly reviewRepository;
    private readonly productRepository;
    private readonly notificationService;
    constructor(reviewRepository: Repository<TransactionReview>, productRepository: Repository<Product>, notificationService: NotificationService);
    createReview(userId: number, dto: CreateReviewDto, qr?: QueryRunner): Promise<ReviewResponseDto>;
    getReviewById(reviewId: number): Promise<ReviewResponseDto>;
    getBuyerReviews(userId: number, page?: number, limit?: number): Promise<PaginationResponseDto<ReviewResponseDto>>;
    getSellerReviews(userId: number, page?: number, limit?: number): Promise<PaginationResponseDto<ReviewResponseDto>>;
    getAllReviewsByUserId(targetUserId: number, page?: number, limit?: number): Promise<PaginationResponseDto<ReviewResponseDto>>;
    checkReviewExists(userId: number, dto: CheckReviewExistsDto): Promise<boolean>;
    getUserReviewStats(userId: number): Promise<{
        reviewCount: number;
        averageRating: number;
    }>;
    private toReviewResponse;
}
