import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { NotificationType } from '../entity/notification.entity';

export class NotificationResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty({ enum: NotificationType })
  notificationType: NotificationType;

  @ApiProperty()
  title: string;

  @ApiProperty()
  body: string;

  @ApiPropertyOptional()
  data?: Record<string, any>;

  @ApiProperty()
  isRead: boolean;

  @ApiPropertyOptional()
  readAt?: Date;

  @ApiProperty()
  createdAt: Date;
}
