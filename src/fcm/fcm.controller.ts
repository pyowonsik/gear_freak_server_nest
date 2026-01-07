import { Body, Controller, Delete, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { FcmService } from './fcm.service';
import { UserId } from '../common/decorator';
import { RegisterFcmTokenDto, DeleteFcmTokenDto } from './dto';

@Controller('fcm')
@ApiTags('fcm')
@ApiBearerAuth()
export class FcmController {
  constructor(private readonly fcmService: FcmService) {}

  @Post('token')
  @ApiOperation({
    summary: 'FCM 토큰 등록',
    description: '디바이스의 FCM 토큰을 등록합니다.',
  })
  @ApiResponse({ status: 201, description: 'FCM 토큰 등록 성공' })
  async registerToken(
    @UserId() userId: number,
    @Body() dto: RegisterFcmTokenDto,
  ): Promise<{ message: string }> {
    await this.fcmService.registerToken(userId, dto.token, dto.deviceType);
    return { message: 'FCM 토큰이 등록되었습니다.' };
  }

  @Delete('token')
  @ApiOperation({
    summary: 'FCM 토큰 삭제',
    description: '디바이스의 FCM 토큰을 삭제합니다.',
  })
  @ApiResponse({ status: 200, description: 'FCM 토큰 삭제 성공' })
  async deleteToken(
    @UserId() userId: number,
    @Body() dto: DeleteFcmTokenDto,
  ): Promise<{ message: string }> {
    await this.fcmService.deleteToken(userId, dto.token);
    return { message: 'FCM 토큰이 삭제되었습니다.' };
  }
}
