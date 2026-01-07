import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseTable } from '../../common/entity/base-table.entity';
import { User } from '../../user/entity/user.entity';

export enum ProductCategory {
  equipment = 'equipment',
  supplement = 'supplement',
  clothing = 'clothing',
  shoes = 'shoes',
  etc = 'etc',
}

export enum ProductCondition {
  brandNew = 'brandNew',
  usedExcellent = 'usedExcellent',
  usedGood = 'usedGood',
  usedFair = 'usedFair',
}

export enum TradeMethod {
  direct = 'direct',
  delivery = 'delivery',
  both = 'both',
}

export enum ProductStatus {
  selling = 'selling',
  reserved = 'reserved',
  sold = 'sold',
}

@Entity()
@Index(['sellerId'])
@Index(['category'])
@Index(['createdAt'])
export class Product extends BaseTable {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sellerId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'sellerId' })
  seller: User;

  @Column()
  title: string;

  @Column({ type: 'enum', enum: ProductCategory })
  category: ProductCategory;

  @Column()
  price: number;

  @Column({ type: 'enum', enum: ProductCondition })
  condition: ProductCondition;

  @Column('text')
  description: string;

  @Column({ type: 'enum', enum: TradeMethod })
  tradeMethod: TradeMethod;

  @Column({ nullable: true })
  baseAddress: string;

  @Column({ nullable: true })
  detailAddress: string;

  @Column('simple-array', { nullable: true })
  imageUrls: string[];

  @Column({ default: 0 })
  viewCount: number;

  @Column({ default: 0 })
  favoriteCount: number;

  @Column({ default: 0 })
  chatCount: number;

  @Column({ type: 'enum', enum: ProductStatus, default: ProductStatus.selling })
  status: ProductStatus;
}
