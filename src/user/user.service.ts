import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryRunner } from 'typeorm';

import { User } from './entity/user.entity';
import { UpdateProfileDto, UserResponseDto } from './dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Get current user
   */
  async getMe(userId: number): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    return this.toUserResponse(user);
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: number): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    return this.toUserResponse(user);
  }

  /**
   * Update user profile
   */
  async updateProfile(
    userId: number,
    dto: UpdateProfileDto,
    qr?: QueryRunner,
  ): Promise<UserResponseDto> {
    const repository = qr
      ? qr.manager.getRepository(User)
      : this.userRepository;

    const user = await repository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    // Check nickname uniqueness
    if (dto.nickname && dto.nickname !== user.nickname) {
      const existingUser = await repository.findOne({
        where: { nickname: dto.nickname },
      });

      if (existingUser) {
        throw new BadRequestException('이미 사용 중인 닉네임입니다.');
      }
    }

    // Update fields
    if (dto.nickname !== undefined) {
      user.nickname = dto.nickname;
    }
    if (dto.profileImageUrl !== undefined) {
      user.profileImageUrl = dto.profileImageUrl;
    }
    if (dto.bio !== undefined) {
      user.bio = dto.bio;
    }

    const savedUser = await repository.save(user);

    return this.toUserResponse(savedUser);
  }

  /**
   * Delete user (soft delete - withdrawal)
   */
  async deleteUser(userId: number, qr?: QueryRunner): Promise<void> {
    const repository = qr
      ? qr.manager.getRepository(User)
      : this.userRepository;

    const user = await repository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    user.withdrawalDate = new Date();
    await repository.save(user);
  }

  /**
   * Find user by ID (for internal use)
   */
  async findById(userId: number): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id: userId },
    });
  }

  // ==================== Private Methods ====================

  private toUserResponse(user: User): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      profileImageUrl: user.profileImageUrl,
      bio: user.bio,
      createdAt: user.createdAt,
    };
  }
}
