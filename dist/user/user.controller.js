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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const user_service_1 = require("./user.service");
const decorator_1 = require("../common/decorator");
const interceptor_1 = require("../common/interceptor");
const dto_1 = require("./dto");
let UserController = class UserController {
    userService;
    constructor(userService) {
        this.userService = userService;
    }
    async getMe(userId) {
        return this.userService.getMe(userId);
    }
    async getUserById(id) {
        return this.userService.getUserById(id);
    }
    async updateProfile(userId, dto, qr) {
        return this.userService.updateProfile(userId, dto, qr);
    }
    async deleteMe(userId, qr) {
        await this.userService.deleteUser(userId, qr);
        return { message: '회원 탈퇴가 완료되었습니다.' };
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Get)('me'),
    (0, swagger_1.ApiOperation)({
        summary: '내 정보 조회',
        description: '현재 로그인한 사용자의 정보를 조회합니다.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '사용자 정보',
        type: dto_1.UserResponseDto,
    }),
    __param(0, (0, decorator_1.UserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getMe", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: '사용자 정보 조회',
        description: 'ID로 사용자 정보를 조회합니다.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '사용자 정보',
        type: dto_1.UserResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: '사용자를 찾을 수 없음' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserById", null);
__decorate([
    (0, common_1.Patch)('profile'),
    (0, common_1.UseInterceptors)(interceptor_1.TransactionInterceptor),
    (0, swagger_1.ApiOperation)({
        summary: '프로필 수정',
        description: '사용자 프로필 정보를 수정합니다.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '수정된 사용자 정보',
        type: dto_1.UserResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: '닉네임 중복' }),
    __param(0, (0, decorator_1.UserId)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, decorator_1.QueryRunner)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, dto_1.UpdateProfileDto, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Delete)('me'),
    (0, common_1.UseInterceptors)(interceptor_1.TransactionInterceptor),
    (0, swagger_1.ApiOperation)({
        summary: '회원 탈퇴',
        description: '현재 로그인한 사용자를 탈퇴 처리합니다.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '탈퇴 완료' }),
    __param(0, (0, decorator_1.UserId)()),
    __param(1, (0, decorator_1.QueryRunner)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "deleteMe", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)('user'),
    (0, swagger_1.ApiTags)('user'),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map