import type { QueryRunner as QR } from 'typeorm';
import { UserService } from './user.service';
import { UpdateProfileDto, UserResponseDto } from './dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getMe(userId: number): Promise<UserResponseDto>;
    getUserById(id: number): Promise<UserResponseDto>;
    updateProfile(userId: number, dto: UpdateProfileDto, qr: QR): Promise<UserResponseDto>;
    deleteMe(userId: number, qr: QR): Promise<{
        message: string;
    }>;
}
