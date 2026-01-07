import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PagePaginationDto } from '../../common/dto';
import { ProductCategory, ProductStatus } from '../entity/product.entity';

export class GetProductsDto extends PagePaginationDto {
  @ApiPropertyOptional({
    description: '카테고리 필터',
    enum: ProductCategory,
  })
  @IsOptional()
  @IsEnum(ProductCategory)
  category?: ProductCategory;

  @ApiPropertyOptional({
    description: '상태 필터',
    enum: ProductStatus,
  })
  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;

  @ApiPropertyOptional({
    description: '검색어',
    example: '러닝화',
  })
  @IsOptional()
  @IsString()
  search?: string;
}
