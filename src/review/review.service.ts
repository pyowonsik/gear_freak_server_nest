import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryRunner } from 'typeorm';

import {
  TransactionReview,
  ReviewType,
} from './entity/transaction-review.entity';
import { Product } from '../product/entity/product.entity';
import {
  CreateReviewDto,
  ReviewResponseDto,
  CheckReviewExistsDto,
} from './dto';
import { PaginationResponseDto } from '../common/dto';
import { NotificationService } from '../notification/notification.service';
import { NotificationType } from '../notification/entity/notification.entity';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(TransactionReview)
    private readonly reviewRepository: Repository<TransactionReview>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly notificationService: NotificationService,
  ) {}

  /**
   * Create review
   */
  async createReview(
    userId: number,
    dto: CreateReviewDto,
    qr?: QueryRunner,
  ): Promise<ReviewResponseDto> {
    const repository = qr
      ? qr.manager.getRepository(TransactionReview)
      : this.reviewRepository;

    // Verify product exists
    const product = await this.productRepository.findOne({
      where: { id: dto.productId },
    });

    if (!product) {
      throw new NotFoundException('상품을 찾을 수 없습니다.');
    }

    // Check if review already exists
    const existingReview = await repository.findOne({
      where: {
        productId: dto.productId,
        reviewerId: userId,
        reviewType: dto.reviewType,
      },
    });

    if (existingReview) {
      throw new BadRequestException('이미 리뷰를 작성했습니다.');
    }

    // Validate reviewer is not reviewee
    if (userId === dto.revieweeId) {
      throw new BadRequestException('자신에게 리뷰를 작성할 수 없습니다.');
    }

    // Create review
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

    // Send notification
    await this.notificationService.createNotification({
      userId: dto.revieweeId,
      type: NotificationType.review_received,
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

  /**
   * Get review by ID
   */
  async getReviewById(reviewId: number): Promise<ReviewResponseDto> {
    const review = await this.reviewRepository.findOne({
      where: { id: reviewId },
      relations: ['reviewer', 'reviewee', 'product'],
    });

    if (!review) {
      throw new NotFoundException('리뷰를 찾을 수 없습니다.');
    }

    return this.toReviewResponse(review);
  }

  /**
   * Get reviews received by user (as seller)
   */
  async getBuyerReviews(
    userId: number,
    page: number = 1,
    limit: number = 20,
  ): Promise<PaginationResponseDto<ReviewResponseDto>> {
    const offset = (page - 1) * limit;

    const [reviews, total] = await this.reviewRepository.findAndCount({
      where: {
        revieweeId: userId,
        reviewType: ReviewType.buyer_to_seller,
      },
      relations: ['reviewer', 'reviewee', 'product'],
      order: { createdAt: 'DESC' },
      skip: offset,
      take: limit,
    });

    const items = reviews.map((r) => this.toReviewResponse(r));

    return new PaginationResponseDto(items, total, page, limit);
  }

  /**
   * Get reviews received by user (as buyer)
   */
  async getSellerReviews(
    userId: number,
    page: number = 1,
    limit: number = 20,
  ): Promise<PaginationResponseDto<ReviewResponseDto>> {
    const offset = (page - 1) * limit;

    const [reviews, total] = await this.reviewRepository.findAndCount({
      where: {
        revieweeId: userId,
        reviewType: ReviewType.seller_to_buyer,
      },
      relations: ['reviewer', 'reviewee', 'product'],
      order: { createdAt: 'DESC' },
      skip: offset,
      take: limit,
    });

    const items = reviews.map((r) => this.toReviewResponse(r));

    return new PaginationResponseDto(items, total, page, limit);
  }

  /**
   * Get all reviews for user
   */
  async getAllReviewsByUserId(
    targetUserId: number,
    page: number = 1,
    limit: number = 20,
  ): Promise<PaginationResponseDto<ReviewResponseDto>> {
    const offset = (page - 1) * limit;

    const [reviews, total] = await this.reviewRepository.findAndCount({
      where: { revieweeId: targetUserId },
      relations: ['reviewer', 'reviewee', 'product'],
      order: { createdAt: 'DESC' },
      skip: offset,
      take: limit,
    });

    const items = reviews.map((r) => this.toReviewResponse(r));

    return new PaginationResponseDto(items, total, page, limit);
  }

  /**
   * Check if review exists
   */
  async checkReviewExists(
    userId: number,
    dto: CheckReviewExistsDto,
  ): Promise<boolean> {
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

  /**
   * Get user review stats
   */
  async getUserReviewStats(
    userId: number,
  ): Promise<{ reviewCount: number; averageRating: number }> {
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

  // ==================== Private Methods ====================

  private toReviewResponse(review: TransactionReview): ReviewResponseDto {
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
}
