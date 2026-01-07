import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { SocialProvider } from '../../user/entity/user.entity';

export class SocialLoginDto {
  @ApiProperty({
    description: '소셜 로그인 제공자',
    enum: SocialProvider,
    example: SocialProvider.kakao,
  })
  @IsEnum(SocialProvider)
  @IsNotEmpty()
  provider: SocialProvider;

  @ApiProperty({
    description: '소셜 로그인 액세스 토큰',
    example: 'access_token_from_social_provider',
  })
  @IsString()
  @IsNotEmpty()
  accessToken: string;

  @ApiPropertyOptional({
    description: 'Apple 로그인 시 필요한 ID Token',
    example: 'apple_id_token',
  })
  @IsString()
  @IsOptional()
  idToken?: string;
}

export class SocialLoginResponseDto {
  @ApiProperty({ description: 'JWT Access Token' })
  accessToken: string;

  @ApiProperty({ description: 'JWT Refresh Token' })
  refreshToken: string;

  @ApiProperty({ description: '사용자 ID' })
  userId: number;

  @ApiProperty({ description: '신규 가입 여부' })
  isNewUser: boolean;
}
