import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { TransactionReview } from './entity/transaction-review.entity';
import { Product } from '../product/entity/product.entity';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransactionReview, Product]),
    NotificationModule,
  ],
  controllers: [ReviewController],
  providers: [ReviewService],
  exports: [ReviewService],
})
export class ReviewModule {}
