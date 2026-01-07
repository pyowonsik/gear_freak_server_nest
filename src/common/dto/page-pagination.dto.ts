import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, Max, Min } from 'class-validator';

export enum SortBy {
  latest = 'latest',
  oldest = 'oldest',
  priceAsc = 'priceAsc',
  priceDesc = 'priceDesc',
  popular = 'popular',
}

export class PagePaginationDto {
  @ApiPropertyOptional({ description: '페이지 번호 (1부터 시작)', default: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: '페이지당 아이템 수', default: 20 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @ApiPropertyOptional({ description: '정렬 기준', enum: SortBy, default: SortBy.latest })
  @IsOptional()
  @IsEnum(SortBy)
  sortBy?: SortBy = SortBy.latest;

  get offset(): number {
    return ((this.page || 1) - 1) * (this.limit || 20);
  }
}

export class PaginationResponseDto<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };

  constructor(items: T[], total: number, page: number, limit: number) {
    this.items = items;
    this.pagination = {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total,
    };
  }
}
