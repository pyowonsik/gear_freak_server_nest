import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export enum BucketType {
  public = 'public',
  private = 'private',
}

export enum FileCategory {
  product = 'product',
  profile = 'profile',
  chatRoom = 'chatRoom',
}

export class GeneratePresignedUrlDto {
  @ApiProperty({
    description: '버킷 타입',
    enum: BucketType,
    example: BucketType.public,
  })
  @IsEnum(BucketType)
  @IsNotEmpty()
  bucketType: BucketType;

  @ApiProperty({
    description: '파일 카테고리',
    enum: FileCategory,
    example: FileCategory.product,
  })
  @IsEnum(FileCategory)
  @IsNotEmpty()
  fileCategory: FileCategory;

  @ApiProperty({
    description: '파일명 (확장자 포함)',
    example: 'image.jpg',
  })
  @IsString()
  @IsNotEmpty()
  fileName: string;

  @ApiProperty({
    description: '파일 Content-Type',
    example: 'image/jpeg',
  })
  @IsString()
  @IsNotEmpty()
  contentType: string;

  @ApiPropertyOptional({
    description: '상품 ID (product 카테고리일 때)',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  productId?: number;

  @ApiPropertyOptional({
    description: '채팅방 ID (chatRoom 카테고리일 때)',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  chatRoomId?: number;
}

export class PresignedUrlResponseDto {
  @ApiProperty({ description: '업로드용 Presigned URL' })
  uploadUrl: string;

  @ApiProperty({ description: '업로드 후 파일 접근 URL' })
  fileUrl: string;

  @ApiProperty({ description: '파일 키 (S3 path)' })
  fileKey: string;
}

export class DeleteFileDto {
  @ApiProperty({
    description: '버킷 타입',
    enum: BucketType,
    example: BucketType.public,
  })
  @IsEnum(BucketType)
  @IsNotEmpty()
  bucketType: BucketType;

  @ApiProperty({
    description: '삭제할 파일 키',
    example: 'product/1/image.jpg',
  })
  @IsString()
  @IsNotEmpty()
  fileKey: string;
}
