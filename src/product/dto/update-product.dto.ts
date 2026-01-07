import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import {
  ProductCategory,
  ProductCondition,
  ProductStatus,
  TradeMethod,
} from '../entity/product.entity';

export class UpdateProductDto {
  @ApiPropertyOptional({
    description: '상품 제목',
    example: '러닝화 나이키 에어줌 페가수스',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  title?: string;

  @ApiPropertyOptional({
    description: '상품 카테고리',
    enum: ProductCategory,
    example: ProductCategory.equipment,
  })
  @IsOptional()
  @IsEnum(ProductCategory)
  category?: ProductCategory;

  @ApiPropertyOptional({
    description: '상품 가격',
    example: 50000,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiPropertyOptional({
    description: '상품 상태',
    enum: ProductCondition,
    example: ProductCondition.usedGood,
  })
  @IsOptional()
  @IsEnum(ProductCondition)
  condition?: ProductCondition;

  @ApiPropertyOptional({
    description: '상품 설명',
    example: '한 달 정도 사용한 러닝화입니다. 상태 좋습니다.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: '거래 방법',
    enum: TradeMethod,
    example: TradeMethod.both,
  })
  @IsOptional()
  @IsEnum(TradeMethod)
  tradeMethod?: TradeMethod;

  @ApiPropertyOptional({
    description: '거래 지역 (기본 주소)',
    example: '서울시 강남구',
  })
  @IsOptional()
  @IsString()
  baseAddress?: string;

  @ApiPropertyOptional({
    description: '거래 지역 (상세 주소)',
    example: '역삼동 123-45',
  })
  @IsOptional()
  @IsString()
  detailAddress?: string;

  @ApiPropertyOptional({
    description: '상품 이미지 URL 목록',
    example: ['https://s3.../image1.jpg', 'https://s3.../image2.jpg'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  imageUrls?: string[];
}

export class UpdateProductStatusDto {
  @ApiPropertyOptional({
    description: '상품 판매 상태',
    enum: ProductStatus,
    example: ProductStatus.sold,
  })
  @IsEnum(ProductStatus)
  status: ProductStatus;
}
