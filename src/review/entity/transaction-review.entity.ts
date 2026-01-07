import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { BaseTable } from '../../common/entity/base-table.entity';
import { User } from '../../user/entity/user.entity';
import { Product } from '../../product/entity/product.entity';
import { ChatRoom } from '../../chat/entity/chat-room.entity';

export enum ReviewType {
  buyer_to_seller = 'buyer_to_seller',
  seller_to_buyer = 'seller_to_buyer',
}

@Entity()
@Unique(['productId', 'chatRoomId', 'reviewerId', 'reviewType'])
@Index(['productId'])
@Index(['revieweeId'])
@Index(['reviewerId'])
@Index(['createdAt'])
export class TransactionReview extends BaseTable {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productId: number;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column()
  chatRoomId: number;

  @ManyToOne(() => ChatRoom, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'chatRoomId' })
  chatRoom: ChatRoom;

  @Column()
  reviewerId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'reviewerId' })
  reviewer: User;

  @Column()
  revieweeId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'revieweeId' })
  reviewee: User;

  @Column({ type: 'enum', enum: ReviewType })
  reviewType: ReviewType;

  @Column({ type: 'int' })
  rating: number;

  @Column({ nullable: true })
  content: string;
}
