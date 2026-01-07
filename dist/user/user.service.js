"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./entity/user.entity");
let UserService = class UserService {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async getMe(userId) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException('사용자를 찾을 수 없습니다.');
        }
        return this.toUserResponse(user);
    }
    async getUserById(userId) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException('사용자를 찾을 수 없습니다.');
        }
        return this.toUserResponse(user);
    }
    async updateProfile(userId, dto, qr) {
        const repository = qr
            ? qr.manager.getRepository(user_entity_1.User)
            : this.userRepository;
        const user = await repository.findOne({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException('사용자를 찾을 수 없습니다.');
        }
        if (dto.nickname && dto.nickname !== user.nickname) {
            const existingUser = await repository.findOne({
                where: { nickname: dto.nickname },
            });
            if (existingUser) {
                throw new common_1.BadRequestException('이미 사용 중인 닉네임입니다.');
            }
        }
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
    async deleteUser(userId, qr) {
        const repository = qr
            ? qr.manager.getRepository(user_entity_1.User)
            : this.userRepository;
        const user = await repository.findOne({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException('사용자를 찾을 수 없습니다.');
        }
        user.withdrawalDate = new Date();
        await repository.save(user);
    }
    async findById(userId) {
        return this.userRepository.findOne({
            where: { id: userId },
        });
    }
    toUserResponse(user) {
        return {
            id: user.id,
            email: user.email,
            nickname: user.nickname,
            profileImageUrl: user.profileImageUrl,
            bio: user.bio,
            createdAt: user.createdAt,
        };
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UserService);
//# sourceMappingURL=user.service.js.map