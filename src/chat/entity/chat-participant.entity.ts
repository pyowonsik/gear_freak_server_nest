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
import { ChatRoom } from './chat-room.entity';

@Entity()
@Unique(['chatRoomId', 'userId'])
@Index(['chatRoomId', 'isActive'])
@Index(['userId', 'isActive'])
export class ChatParticipant extends BaseTable {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  chatRoomId: number;

  @ManyToOne(() => ChatRoom, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'chatRoomId' })
  chatRoom: ChatRoom;

  @Column()
  userId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: true })
  isNotificationEnabled: boolean;

  @Column({ nullable: true })
  lastReadMessageId: number;

  @Column({ nullable: true })
  joinedAt: Date;

  @Column({ nullable: true })
  leftAt: Date;
}
