import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { BaseTable } from '../../common/entity/base-table.entity';
import { User } from '../../user/entity/user.entity';

export enum DeviceType {
  ios = 'ios',
  android = 'android',
  web = 'web',
}

@Entity()
@Unique(['userId', 'token'])
export class FcmToken extends BaseTable {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  token: string;

  @Column({ type: 'enum', enum: DeviceType })
  deviceType: DeviceType;

  @Column({ nullable: true })
  lastUsedAt: Date;
}
