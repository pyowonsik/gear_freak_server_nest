import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { ReportReason } from '../entity/product-report.entity';

export class CreateProductReportDto {
  @ApiProperty({
    description: '신고 사유',
    enum: ReportReason,
    example: ReportReason.fake,
  })
  @IsEnum(ReportReason)
  @IsNotEmpty()
  reason: ReportReason;

  @ApiPropertyOptional({
    description: '상세 설명',
    example: '사기 의심됩니다. 연락이 안 됩니다.',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}
