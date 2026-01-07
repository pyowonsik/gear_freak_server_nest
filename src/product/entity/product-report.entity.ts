import {
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';
import { BaseTable } from '../../common/entity/base-table.entity';
import { User } from '../../user/entity/user.entity';
import { Product } from './product.entity';

export enum ReportReason {
  spam = 'spam',
  inappropriate = 'inappropriate',
  fake = 'fake',
  prohibited = 'prohibited',
  duplicate = 'duplicate',
  other = 'other',
}

export enum ReportStatus {
  pending = 'pending',
  processing = 'processing',
  resolved = 'resolved',
  rejected = 'rejected',
}

@Entity()
@Index(['productId', 'createdAt'])
@Index(['reporterId', 'createdAt'])
@Index(['status', 'createdAt'])
export class ProductReport extends BaseTable {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productId: number;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column()
  reporterId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'reporterId' })
  reporter: User;

  @Column({ type: 'enum', enum: ReportReason })
  reason: ReportReason;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'enum', enum: ReportStatus, default: ReportStatus.pending })
  status: ReportStatus;

  @Column({ nullable: true })
  processedById: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'processedById' })
  processedBy: User;

  @Column({ nullable: true })
  processedAt: Date;

  @Column({ nullable: true })
  processNote: string;
}
