import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { QueryRunner as QR } from 'typeorm';

import { UserService } from './user.service';
import { UserId, QueryRunner } from '../common/decorator';
import { TransactionInterceptor } from '../common/interceptor';
import { UpdateProfileDto, UserResponseDto } from './dto';

@Controller('user')
@ApiTags('user')
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @ApiOperation({
    summary: '내 정보 조회',
    description: '현재 로그인한 사용자의 정보를 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '사용자 정보',
    type: UserResponseDto,
  })
  async getMe(@UserId() userId: number): Promise<UserResponseDto> {
    return this.userService.getMe(userId);
  }

  @Get(':id')
  @ApiOperation({
    summary: '사용자 정보 조회',
    description: 'ID로 사용자 정보를 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '사용자 정보',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: '사용자를 찾을 수 없음' })
  async getUserById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UserResponseDto> {
    return this.userService.getUserById(id);
  }

  @Patch('profile')
  @UseInterceptors(TransactionInterceptor)
  @ApiOperation({
    summary: '프로필 수정',
    description: '사용자 프로필 정보를 수정합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '수정된 사용자 정보',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 400, description: '닉네임 중복' })
  async updateProfile(
    @UserId() userId: number,
    @Body() dto: UpdateProfileDto,
    @QueryRunner() qr: QR,
  ): Promise<UserResponseDto> {
    return this.userService.updateProfile(userId, dto, qr);
  }

  @Delete('me')
  @UseInterceptors(TransactionInterceptor)
  @ApiOperation({
    summary: '회원 탈퇴',
    description: '현재 로그인한 사용자를 탈퇴 처리합니다.',
  })
  @ApiResponse({ status: 200, description: '탈퇴 완료' })
  async deleteMe(
    @UserId() userId: number,
    @QueryRunner() qr: QR,
  ): Promise<{ message: string }> {
    await this.userService.deleteUser(userId, qr);
    return { message: '회원 탈퇴가 완료되었습니다.' };
  }
}
