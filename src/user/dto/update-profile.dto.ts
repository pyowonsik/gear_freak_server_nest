import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateProfileDto {
  @ApiPropertyOptional({
    description: '닉네임 (2-20자)',
    example: '헬스왕',
    minLength: 2,
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(20)
  nickname?: string;

  @ApiPropertyOptional({
    description: '프로필 이미지 URL',
    example: 'https://s3.amazonaws.com/bucket/profile/1/image.jpg',
  })
  @IsOptional()
  @IsString()
  profileImageUrl?: string;

  @ApiPropertyOptional({
    description: '자기소개 (최대 200자)',
    example: '운동 장비 덕후입니다!',
    maxLength: 200,
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  bio?: string;
}
