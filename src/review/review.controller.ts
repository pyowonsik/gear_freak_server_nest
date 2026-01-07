import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { QueryRunner as QR } from 'typeorm';

import { ReviewService } from './review.service';
import { UserId, QueryRunner } from '../common/decorator';
import { TransactionInterceptor } from '../common/interceptor';
import { PagePaginationDto, PaginationResponseDto } from '../common/dto';
import {
  CreateReviewDto,
  ReviewResponseDto,
  CheckReviewExistsDto,
} from './dto';

@Controller('review')
@ApiTags('review')
@ApiBearerAuth()
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  @UseInterceptors(TransactionInterceptor)
  @ApiOperation({
    summary: '리뷰 작성',
    description: '거래 리뷰를 작성합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '리뷰 작성 성공',
    type: ReviewResponseDto,
  })
  @ApiResponse({ status: 400, description: '이미 리뷰를 작성함' })
  async createReview(
    @UserId() userId: number,
    @Body() dto: CreateReviewDto,
    @QueryRunner() qr: QR,
  ): Promise<ReviewResponseDto> {
    return this.reviewService.createReview(userId, dto, qr);
  }

  @Get('buyer')
  @ApiOperation({
    summary: '구매자로부터 받은 리뷰 조회',
    description: '판매자로서 받은 리뷰 목록을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '리뷰 목록',
  })
  async getBuyerReviews(
    @UserId() userId: number,
    @Query() dto: PagePaginationDto,
  ): Promise<PaginationResponseDto<ReviewResponseDto>> {
    return this.reviewService.getBuyerReviews(userId, dto.page, dto.limit);
  }

  @Get('seller')
  @ApiOperation({
    summary: '판매자로부터 받은 리뷰 조회',
    description: '구매자로서 받은 리뷰 목록을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '리뷰 목록',
  })
  async getSellerReviews(
    @UserId() userId: number,
    @Query() dto: PagePaginationDto,
  ): Promise<PaginationResponseDto<ReviewResponseDto>> {
    return this.reviewService.getSellerReviews(userId, dto.page, dto.limit);
  }

  @Get('user/:userId')
  @ApiOperation({
    summary: '특정 사용자의 리뷰 조회',
    description: '특정 사용자가 받은 리뷰 목록을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '리뷰 목록',
  })
  async getAllReviewsByUserId(
    @Param('userId', ParseIntPipe) targetUserId: number,
    @Query() dto: PagePaginationDto,
  ): Promise<PaginationResponseDto<ReviewResponseDto>> {
    return this.reviewService.getAllReviewsByUserId(
      targetUserId,
      dto.page,
      dto.limit,
    );
  }

  @Post('exists')
  @ApiOperation({
    summary: '리뷰 존재 여부 확인',
    description: '특정 조건의 리뷰가 존재하는지 확인합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '리뷰 존재 여부',
  })
  async checkReviewExists(
    @UserId() userId: number,
    @Body() dto: CheckReviewExistsDto,
  ): Promise<{ exists: boolean }> {
    const exists = await this.reviewService.checkReviewExists(userId, dto);
    return { exists };
  }

  @Get('stats')
  @ApiOperation({
    summary: '내 리뷰 통계 조회',
    description: '내가 받은 리뷰 통계를 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '리뷰 통계',
  })
  async getMyReviewStats(
    @UserId() userId: number,
  ): Promise<{ reviewCount: number; averageRating: number }> {
    return this.reviewService.getUserReviewStats(userId);
  }
}
