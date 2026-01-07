import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { Product } from './entity/product.entity';
import { Favorite } from './entity/favorite.entity';
import { ProductView } from './entity/product-view.entity';
import { ProductReport } from './entity/product-report.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Favorite, ProductView, ProductReport]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
