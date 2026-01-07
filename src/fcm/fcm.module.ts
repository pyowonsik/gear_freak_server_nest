import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { FcmController } from './fcm.controller';
import { FcmService } from './fcm.service';
import { FcmToken } from './entity/fcm-token.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FcmToken]), ConfigModule],
  controllers: [FcmController],
  providers: [FcmService],
  exports: [FcmService],
})
export class FcmModule {}
