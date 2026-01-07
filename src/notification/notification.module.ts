import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { Notification } from './entity/notification.entity';
import { FcmModule } from '../fcm/fcm.module';

@Module({
  imports: [TypeOrmModule.forFeature([Notification]), FcmModule],
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
