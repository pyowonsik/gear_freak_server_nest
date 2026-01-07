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
import { ChatRoom } from './chat-room.entity';

export enum MessageType {
  text = 'text',
  image = 'image',
  file = 'file',
  system = 'system',
}

@Entity()
@Index(['chatRoomId', 'createdAt'])
@Index(['senderId', 'createdAt'])
@Index(['messageType'])
export class ChatMessage extends BaseTable {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  chatRoomId: number;

  @ManyToOne(() => ChatRoom, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'chatRoomId' })
  chatRoom: ChatRoom;

  @Column()
  senderId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'senderId' })
  sender: User;

  @Column({ type: 'enum', enum: MessageType, default: MessageType.text })
  messageType: MessageType;

  @Column('text')
  content: string;

  @Column({ nullable: true })
  attachmentUrl: string;

  @Column({ nullable: true })
  attachmentName: string;

  @Column({ type: 'int', nullable: true })
  attachmentSize: number;
}
