import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { ReviewType } from '../entity/transaction-review.entity';

export class CreateReviewDto {
  @ApiProperty({ description: '상품 ID' })
  @IsNumber()
  @IsNotEmpty()
  productId: number;

  @ApiPropertyOptional({ description: '채팅방 ID' })
  @IsOptional()
  @IsNumber()
  chatRoomId?: number;

  @ApiProperty({ description: '리뷰 대상자 ID' })
  @IsNumber()
  @IsNotEmpty()
  revieweeId: number;

  @ApiProperty({
    description: '리뷰 타입',
    enum: ReviewType,
  })
  @IsEnum(ReviewType)
  @IsNotEmpty()
  reviewType: ReviewType;

  @ApiProperty({
    description: '평점 (1-5)',
    minimum: 1,
    maximum: 5,
  })
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiPropertyOptional({
    description: '리뷰 내용',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  content?: string;
}

export class ReviewResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  productId: number;

  @ApiPropertyOptional()
  productTitle?: string;

  @ApiProperty({ enum: ReviewType })
  reviewType: ReviewType;

  @ApiProperty()
  rating: number;

  @ApiPropertyOptional()
  content?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  reviewer: {
    id: number;
    nickname?: string;
    profileImageUrl?: string;
  };

  @ApiProperty()
  reviewee: {
    id: number;
    nickname?: string;
    profileImageUrl?: string;
  };
}

export class CheckReviewExistsDto {
  @ApiProperty({ description: '상품 ID' })
  @IsNumber()
  @IsNotEmpty()
  productId: number;

  @ApiProperty({ description: '리뷰 대상자 ID' })
  @IsNumber()
  @IsNotEmpty()
  revieweeId: number;

  @ApiProperty({
    description: '리뷰 타입',
    enum: ReviewType,
  })
  @IsEnum(ReviewType)
  @IsNotEmpty()
  reviewType: ReviewType;
}
