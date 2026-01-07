import type { QueryRunner as QR } from 'typeorm';
import { ReviewService } from './review.service';
import { PagePaginationDto, PaginationResponseDto } from '../common/dto';
import { CreateReviewDto, ReviewResponseDto, CheckReviewExistsDto } from './dto';
export declare class ReviewController {
    private readonly reviewService;
    constructor(reviewService: ReviewService);
    createReview(userId: number, dto: CreateReviewDto, qr: QR): Promise<ReviewResponseDto>;
    getBuyerReviews(userId: number, dto: PagePaginationDto): Promise<PaginationResponseDto<ReviewResponseDto>>;
    getSellerReviews(userId: number, dto: PagePaginationDto): Promise<PaginationResponseDto<ReviewResponseDto>>;
    getAllReviewsByUserId(targetUserId: number, dto: PagePaginationDto): Promise<PaginationResponseDto<ReviewResponseDto>>;
    checkReviewExists(userId: number, dto: CheckReviewExistsDto): Promise<{
        exists: boolean;
    }>;
    getMyReviewStats(userId: number): Promise<{
        reviewCount: number;
        averageRating: number;
    }>;
}
