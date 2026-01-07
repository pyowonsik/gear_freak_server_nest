import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ProductCategory,
  ProductCondition,
  ProductStatus,
  TradeMethod,
} from '../entity/product.entity';

export class ProductSellerDto {
  @ApiProperty()
  id: number;

  @ApiPropertyOptional()
  nickname?: string;

  @ApiPropertyOptional()
  profileImageUrl?: string;
}

export class ProductResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty({ enum: ProductCategory })
  category: ProductCategory;

  @ApiProperty()
  price: number;

  @ApiProperty({ enum: ProductCondition })
  condition: ProductCondition;

  @ApiProperty()
  description: string;

  @ApiProperty({ enum: TradeMethod })
  tradeMethod: TradeMethod;

  @ApiPropertyOptional()
  baseAddress?: string;

  @ApiPropertyOptional()
  detailAddress?: string;

  @ApiProperty({ type: [String] })
  imageUrls: string[];

  @ApiProperty()
  viewCount: number;

  @ApiProperty()
  favoriteCount: number;

  @ApiProperty()
  chatCount: number;

  @ApiProperty({ enum: ProductStatus })
  status: ProductStatus;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ type: ProductSellerDto })
  seller: ProductSellerDto;

  @ApiPropertyOptional({ description: '현재 사용자의 찜 여부' })
  isFavorite?: boolean;
}

export class ProductListItemDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty({ enum: ProductCategory })
  category: ProductCategory;

  @ApiProperty()
  price: number;

  @ApiProperty({ enum: ProductStatus })
  status: ProductStatus;

  @ApiPropertyOptional()
  thumbnailUrl?: string;

  @ApiProperty()
  favoriteCount: number;

  @ApiProperty()
  chatCount: number;

  @ApiProperty()
  createdAt: Date;

  @ApiPropertyOptional({ description: '현재 사용자의 찜 여부' })
  isFavorite?: boolean;
}

export class ProductStatsDto {
  @ApiProperty({ description: '판매중 상품 수' })
  sellingCount: number;

  @ApiProperty({ description: '판매완료 상품 수' })
  soldCount: number;

  @ApiProperty({ description: '받은 리뷰 수' })
  reviewCount: number;

  @ApiProperty({ description: '평균 평점' })
  averageRating: number;
}
