import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { ChatRoom } from './entity/chat-room.entity';
import { ChatParticipant } from './entity/chat-participant.entity';
import { ChatMessage } from './entity/chat-message.entity';
import { Product } from '../product/entity/product.entity';
import { AuthModule } from '../auth/auth.module';
import { FcmModule } from '../fcm/fcm.module';
import { S3Module } from '../s3/s3.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatRoom, ChatParticipant, ChatMessage, Product]),
    forwardRef(() => AuthModule),
    FcmModule,
    S3Module,
  ],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway],
  exports: [ChatService],
})
export class ChatModule {}
