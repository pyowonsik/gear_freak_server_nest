import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseTable } from '../../common/entity/base-table.entity';
import { Exclude } from 'class-transformer';
import { ApiHideProperty } from '@nestjs/swagger';

export enum Role {
  admin = 0,
  user = 1,
}

export enum SocialProvider {
  kakao = 'kakao',
  naver = 'naver',
  google = 'google',
  apple = 'apple',
  email = 'email',
}

@Entity()
export class User extends BaseTable {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  socialId: string;

  @Column({ type: 'enum', enum: SocialProvider, default: SocialProvider.email })
  socialProvider: SocialProvider;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column({ nullable: true, select: false })
  @Exclude()
  @ApiHideProperty()
  password: string;

  @Column({ nullable: true })
  nickname: string;

  @Column({ nullable: true })
  profileImageUrl: string;

  @Column({ nullable: true })
  bio: string;

  @Column({ type: 'enum', enum: Role, default: Role.user })
  role: Role;

  @Column({ nullable: true })
  lastLoginAt: Date;

  @Column({ nullable: true })
  blockedAt: Date;

  @Column({ nullable: true })
  blockedReason: string;

  @Column({ nullable: true })
  withdrawalDate: Date;
}
