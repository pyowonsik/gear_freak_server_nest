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
import { Product } from '../../product/entity/product.entity';

export enum ChatRoomType {
  direct = 'direct',
  group = 'group',
}

@Entity()
@Index(['productId'])
@Index(['lastActivityAt'])
@Index(['chatRoomType'])
export class ChatRoom extends BaseTable {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productId: number;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column({ nullable: true })
  title: string;

  @Column({ type: 'enum', enum: ChatRoomType, default: ChatRoomType.direct })
  chatRoomType: ChatRoomType;

  @Column({ default: 0 })
  participantCount: number;

  @Column({ nullable: true })
  lastActivityAt: Date;
}
