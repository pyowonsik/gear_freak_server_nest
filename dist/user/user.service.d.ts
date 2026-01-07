import { Repository, QueryRunner } from 'typeorm';
import { User } from './entity/user.entity';
import { UpdateProfileDto, UserResponseDto } from './dto';
export declare class UserService {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    getMe(userId: number): Promise<UserResponseDto>;
    getUserById(userId: number): Promise<UserResponseDto>;
    updateProfile(userId: number, dto: UpdateProfileDto, qr?: QueryRunner): Promise<UserResponseDto>;
    deleteUser(userId: number, qr?: QueryRunner): Promise<void>;
    findById(userId: number): Promise<User | null>;
    private toUserResponse;
}
