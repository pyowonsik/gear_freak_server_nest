import { ReviewType } from '../entity/transaction-review.entity';
export declare class CreateReviewDto {
    productId: number;
    chatRoomId?: number;
    revieweeId: number;
    reviewType: ReviewType;
    rating: number;
    content?: string;
}
export declare class ReviewResponseDto {
    id: number;
    productId: number;
    productTitle?: string;
    reviewType: ReviewType;
    rating: number;
    content?: string;
    createdAt: Date;
    reviewer: {
        id: number;
        nickname?: string;
        profileImageUrl?: string;
    };
    reviewee: {
        id: number;
        nickname?: string;
        profileImageUrl?: string;
    };
}
export declare class CheckReviewExistsDto {
    productId: number;
    revieweeId: number;
    reviewType: ReviewType;
}
