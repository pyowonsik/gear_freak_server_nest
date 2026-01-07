import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ description: '사용자 ID' })
  id: number;

  @ApiPropertyOptional({ description: '이메일' })
  email?: string;

  @ApiPropertyOptional({ description: '닉네임' })
  nickname?: string;

  @ApiPropertyOptional({ description: '프로필 이미지 URL' })
  profileImageUrl?: string;

  @ApiPropertyOptional({ description: '자기소개' })
  bio?: string;

  @ApiProperty({ description: '가입일' })
  createdAt: Date;
}

export class UserStatsResponseDto {
  @ApiProperty({ description: '판매중인 상품 수' })
  sellingCount: number;

  @ApiProperty({ description: '판매완료 상품 수' })
  soldCount: number;

  @ApiProperty({ description: '받은 리뷰 수' })
  reviewCount: number;

  @ApiProperty({ description: '평균 평점' })
  averageRating: number;
}
