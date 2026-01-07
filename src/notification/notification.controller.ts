import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { NotificationService } from './notification.service';
import { UserId } from '../common/decorator';
import { PagePaginationDto, PaginationResponseDto } from '../common/dto';
import { NotificationResponseDto } from './dto';

@Controller('notification')
@ApiTags('notification')
@ApiBearerAuth()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @ApiOperation({
    summary: '알림 목록 조회',
    description: '알림 목록을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '알림 목록',
  })
  async getNotifications(
    @UserId() userId: number,
    @Query() dto: PagePaginationDto,
  ): Promise<PaginationResponseDto<NotificationResponseDto>> {
    return this.notificationService.getNotifications(userId, dto.page, dto.limit);
  }

  @Patch(':id/read')
  @ApiOperation({
    summary: '알림 읽음 처리',
    description: '알림을 읽음 처리합니다.',
  })
  @ApiResponse({ status: 200, description: '읽음 처리 완료' })
  async markAsRead(
    @UserId() userId: number,
    @Param('id', ParseIntPipe) notificationId: number,
  ): Promise<{ message: string }> {
    await this.notificationService.markAsRead(userId, notificationId);
    return { message: '읽음 처리되었습니다.' };
  }

  @Delete(':id')
  @ApiOperation({
    summary: '알림 삭제',
    description: '알림을 삭제합니다.',
  })
  @ApiResponse({ status: 200, description: '삭제 완료' })
  async deleteNotification(
    @UserId() userId: number,
    @Param('id', ParseIntPipe) notificationId: number,
  ): Promise<{ message: string }> {
    await this.notificationService.deleteNotification(userId, notificationId);
    return { message: '알림이 삭제되었습니다.' };
  }

  @Get('unread-count')
  @ApiOperation({
    summary: '안읽은 알림 수 조회',
    description: '안읽은 알림 수를 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '안읽은 알림 수',
  })
  async getUnreadCount(
    @UserId() userId: number,
  ): Promise<{ unreadCount: number }> {
    const unreadCount = await this.notificationService.getUnreadCount(userId);
    return { unreadCount };
  }

  @Post('read-all')
  @ApiOperation({
    summary: '모든 알림 읽음 처리',
    description: '모든 알림을 읽음 처리합니다.',
  })
  @ApiResponse({ status: 201, description: '읽음 처리 완료' })
  async markAllAsRead(@UserId() userId: number): Promise<{ message: string }> {
    await this.notificationService.markAllAsRead(userId);
    return { message: '모든 알림이 읽음 처리되었습니다.' };
  }
}
