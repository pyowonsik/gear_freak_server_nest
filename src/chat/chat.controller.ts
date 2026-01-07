import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { QueryRunner as QR } from 'typeorm';

import { ChatService } from './chat.service';
import { UserId, QueryRunner } from '../common/decorator';
import { TransactionInterceptor } from '../common/interceptor';
import { PagePaginationDto, CursorPaginationResponseDto } from '../common/dto';
import {
  CreateChatRoomDto,
  GetChatMessagesDto,
  ChatRoomResponseDto,
  ChatMessageResponseDto,
  ChatParticipantResponseDto,
  UpdateChatRoomNotificationDto,
} from './dto';
import { S3Service } from '../s3/s3.service';
import { GeneratePresignedUrlDto, PresignedUrlResponseDto } from '../s3/dto';

@Controller('chat')
@ApiTags('chat')
@ApiBearerAuth()
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly s3Service: S3Service,
  ) {}

  @Post('room')
  @UseInterceptors(TransactionInterceptor)
  @ApiOperation({
    summary: '채팅방 생성/조회',
    description: '상품에 대한 채팅방을 생성하거나 기존 채팅방을 조회합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '채팅방 정보',
    type: ChatRoomResponseDto,
  })
  async createOrGetChatRoom(
    @UserId() userId: number,
    @Body() dto: CreateChatRoomDto,
    @QueryRunner() qr: QR,
  ): Promise<ChatRoomResponseDto> {
    return this.chatService.createOrGetChatRoom(userId, dto, qr);
  }

  @Get('room')
  @ApiOperation({
    summary: '내 채팅방 목록 조회',
    description: '내가 참여한 채팅방 목록을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '채팅방 목록',
  })
  async getMyChatRooms(
    @UserId() userId: number,
    @Query() dto: PagePaginationDto,
  ): Promise<{ items: ChatRoomResponseDto[]; total: number }> {
    return this.chatService.getMyChatRooms(userId, dto.page, dto.limit);
  }

  @Get('room/:id')
  @ApiOperation({
    summary: '채팅방 상세 조회',
    description: '채팅방 상세 정보를 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '채팅방 정보',
    type: ChatRoomResponseDto,
  })
  async getChatRoomById(
    @UserId() userId: number,
    @Param('id', ParseIntPipe) chatRoomId: number,
  ): Promise<ChatRoomResponseDto> {
    return this.chatService.getChatRoomById(chatRoomId, userId);
  }

  @Get('room/:id/messages')
  @ApiOperation({
    summary: '채팅 메시지 조회',
    description: '채팅방의 메시지를 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '메시지 목록',
  })
  async getChatMessages(
    @UserId() userId: number,
    @Param('id', ParseIntPipe) chatRoomId: number,
    @Query() dto: GetChatMessagesDto,
  ): Promise<CursorPaginationResponseDto<ChatMessageResponseDto>> {
    return this.chatService.getChatMessages(userId, chatRoomId, dto);
  }

  @Post('room/:id/read')
  @ApiOperation({
    summary: '채팅방 읽음 처리',
    description: '채팅방의 메시지를 읽음 처리합니다.',
  })
  @ApiResponse({ status: 201, description: '읽음 처리 완료' })
  async markChatRoomAsRead(
    @UserId() userId: number,
    @Param('id', ParseIntPipe) chatRoomId: number,
  ): Promise<{ message: string }> {
    await this.chatService.markChatRoomAsRead(userId, chatRoomId);
    return { message: '읽음 처리되었습니다.' };
  }

  @Get('unread-count')
  @ApiOperation({
    summary: '총 안읽은 메시지 수 조회',
    description: '모든 채팅방의 안읽은 메시지 총 수를 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '안읽은 메시지 수',
  })
  async getTotalUnreadChatCount(
    @UserId() userId: number,
  ): Promise<{ unreadCount: number }> {
    const unreadCount = await this.chatService.getTotalUnreadChatCount(userId);
    return { unreadCount };
  }

  @Get('product/:productId/rooms')
  @ApiOperation({
    summary: '상품별 채팅방 목록 조회',
    description: '특정 상품에 대한 모든 채팅방을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '채팅방 목록',
    type: [ChatRoomResponseDto],
  })
  async getChatRoomsByProductId(
    @Param('productId', ParseIntPipe) productId: number,
  ): Promise<ChatRoomResponseDto[]> {
    return this.chatService.getChatRoomsByProductId(productId);
  }

  @Get('product/:productId/my-rooms')
  @ApiOperation({
    summary: '내가 참여한 상품별 채팅방 조회',
    description: '특정 상품에 대해 내가 참여한 채팅방을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '채팅방 목록',
    type: [ChatRoomResponseDto],
  })
  async getUserChatRoomsByProductId(
    @UserId() userId: number,
    @Param('productId', ParseIntPipe) productId: number,
  ): Promise<ChatRoomResponseDto[]> {
    return this.chatService.getUserChatRoomsByProductId(userId, productId);
  }

  @Get('room/:id/last-message')
  @ApiOperation({
    summary: '채팅방 마지막 메시지 조회',
    description: '채팅방의 가장 최근 메시지를 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '마지막 메시지',
    type: ChatMessageResponseDto,
  })
  async getLastMessageByChatRoomId(
    @Param('id', ParseIntPipe) chatRoomId: number,
  ): Promise<ChatMessageResponseDto | null> {
    return this.chatService.getLastMessageByChatRoomId(chatRoomId);
  }

  @Post('room/:id/upload-url')
  @ApiOperation({
    summary: '채팅 이미지 업로드 URL 생성',
    description: '채팅방에서 사용할 이미지 업로드를 위한 presigned URL을 생성합니다.',
  })
  @ApiResponse({
    status: 201,
    description: 'Presigned URL 정보',
    type: PresignedUrlResponseDto,
  })
  async generateChatRoomImageUploadUrl(
    @UserId() userId: number,
    @Param('id', ParseIntPipe) chatRoomId: number,
    @Body() dto: GeneratePresignedUrlDto,
  ): Promise<PresignedUrlResponseDto> {
    return this.s3Service.generatePresignedUploadUrl(userId, {
      ...dto,
      chatRoomId,
    });
  }

  @Get('room/:id/participants')
  @ApiOperation({
    summary: '채팅방 참여자 목록 조회',
    description: '채팅방의 모든 참여자 정보를 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '참여자 목록',
    type: [ChatParticipantResponseDto],
  })
  async getChatParticipants(
    @Param('id', ParseIntPipe) chatRoomId: number,
  ): Promise<ChatParticipantResponseDto[]> {
    return this.chatService.getChatParticipants(chatRoomId);
  }

  @Patch('room/:id/notification')
  @ApiOperation({
    summary: '채팅방 알림 설정 변경',
    description: '채팅방의 알림 수신 여부를 변경합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '알림 설정 변경 성공',
  })
  async updateChatRoomNotification(
    @UserId() userId: number,
    @Param('id', ParseIntPipe) chatRoomId: number,
    @Body() dto: UpdateChatRoomNotificationDto,
  ): Promise<{ message: string }> {
    await this.chatService.updateChatRoomNotification(
      userId,
      chatRoomId,
      dto.isNotificationEnabled,
    );
    return { message: '알림 설정이 변경되었습니다.' };
  }
}
