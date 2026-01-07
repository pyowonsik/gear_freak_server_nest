import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { Public } from '../common/decorator';
import {
  SocialLoginDto,
  SocialLoginResponseDto,
  RefreshTokenDto,
  TokenResponseDto,
} from './dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public(true)
  @Post('social')
  @ApiOperation({
    summary: '소셜 로그인',
    description: '카카오, 네이버, 구글, 애플 소셜 로그인을 처리합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '로그인 성공',
    type: SocialLoginResponseDto,
  })
  @ApiResponse({ status: 401, description: '토큰 검증 실패' })
  async socialLogin(
    @Body() dto: SocialLoginDto,
  ): Promise<SocialLoginResponseDto> {
    return this.authService.socialLogin(dto);
  }

  @Public(true)
  @Post('refresh')
  @ApiOperation({
    summary: '토큰 갱신',
    description: 'Refresh Token을 사용하여 새로운 Access Token을 발급합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '토큰 갱신 성공',
    type: TokenResponseDto,
  })
  @ApiResponse({ status: 401, description: '유효하지 않은 토큰' })
  async refreshToken(@Body() dto: RefreshTokenDto): Promise<TokenResponseDto> {
    return this.authService.refreshToken(dto.refreshToken);
  }
}
