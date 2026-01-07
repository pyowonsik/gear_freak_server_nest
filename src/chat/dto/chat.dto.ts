import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { MessageType } from '../entity/chat-message.entity';
import { CursorPaginationDto } from '../../common/dto';

export class CreateChatRoomDto {
  @ApiProperty({ description: '상품 ID' })
  @IsNumber()
  @IsNotEmpty()
  productId: number;

  @ApiProperty({ description: '판매자 ID' })
  @IsNumber()
  @IsNotEmpty()
  sellerId: number;
}

export class SendMessageDto {
  @ApiProperty({ description: '채팅방 ID' })
  @IsNumber()
  @IsNotEmpty()
  chatRoomId: number;

  @ApiPropertyOptional({ description: '메시지 내용' })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({
    description: '메시지 타입',
    enum: MessageType,
    default: MessageType.text,
  })
  @IsEnum(MessageType)
  messageType: MessageType;

  @ApiPropertyOptional({ description: '첨부 파일 URL' })
  @IsOptional()
  @IsString()
  attachmentUrl?: string;

  @ApiPropertyOptional({ description: '첨부 파일 이름' })
  @IsOptional()
  @IsString()
  attachmentName?: string;

  @ApiPropertyOptional({ description: '첨부 파일 크기 (bytes)' })
  @IsOptional()
  @IsNumber()
  attachmentSize?: number;
}

export class GetChatMessagesDto extends CursorPaginationDto {}

export class ChatRoomResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  productId: number;

  @ApiProperty()
  productTitle: string;

  @ApiPropertyOptional()
  productThumbnail?: string;

  @ApiProperty()
  otherUser: {
    id: number;
    nickname?: string;
    profileImageUrl?: string;
  };

  @ApiPropertyOptional()
  lastMessage?: {
    content?: string;
    messageType: MessageType;
    createdAt: Date;
  };

  @ApiProperty()
  unreadCount: number;

  @ApiProperty()
  lastActivityAt: Date;
}

export class ChatMessageResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  chatRoomId: number;

  @ApiProperty()
  senderId: number;

  @ApiProperty({ enum: MessageType })
  messageType: MessageType;

  @ApiPropertyOptional()
  content?: string;

  @ApiPropertyOptional()
  attachmentUrl?: string;

  @ApiPropertyOptional()
  attachmentName?: string;

  @ApiPropertyOptional()
  attachmentSize?: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  sender: {
    id: number;
    nickname?: string;
    profileImageUrl?: string;
  };
}

export class ChatParticipantResponseDto {
  @ApiProperty()
  userId: number;

  @ApiProperty()
  user: {
    id: number;
    nickname?: string;
    profileImageUrl?: string;
  };

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  isNotificationEnabled: boolean;

  @ApiProperty()
  joinedAt: Date;

  @ApiPropertyOptional()
  lastReadMessageId?: number;
}

export class UpdateChatRoomNotificationDto {
  @ApiProperty({ description: '알림 활성화 여부' })
  @IsBoolean()
  @IsNotEmpty()
  isNotificationEnabled: boolean;
}
