import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseTable } from '../../common/entity/base-table.entity';
import { User } from '../../user/entity/user.entity';

export enum NotificationType {
  chat_message = 'chat_message',
  review_received = 'review_received',
  product_favorited = 'product_favorited',
  product_sold = 'product_sold',
  system = 'system',
}

@Entity()
@Index(['userId', 'createdAt'])
@Index(['userId', 'isRead'])
@Index(['notificationType'])
export class Notification extends BaseTable {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'enum', enum: NotificationType })
  notificationType: NotificationType;

  @Column()
  title: string;

  @Column()
  body: string;

  @Column('simple-json', { nullable: true })
  data: Record<string, any>;

  @Column({ default: false })
  isRead: boolean;

  @Column({ nullable: true })
  readAt: Date;

  @Column({ nullable: true })
  referenceId: number;

  @Column({ nullable: true })
  referenceType: string;
}
