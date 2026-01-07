import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, Max, Min } from 'class-validator';

export class CursorPaginationDto {
  @ApiPropertyOptional({ description: '커서 (마지막 아이템의 ID)' })
  @IsOptional()
  @IsNumber()
  cursor?: number;

  @ApiPropertyOptional({ description: '가져올 아이템 수', default: 20 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}

export class CursorPaginationResponseDto<T extends { id: number }> {
  items: T[];
  pagination: {
    cursor: number | null;
    limit: number;
    hasMore: boolean;
  };

  constructor(items: T[], limit: number, hasMore: boolean) {
    this.items = items;
    this.pagination = {
      cursor: items.length > 0 ? items[items.length - 1].id : null,
      limit,
      hasMore,
    };
  }
}
