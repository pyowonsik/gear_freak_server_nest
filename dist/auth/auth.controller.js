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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_service_1 = require("./auth.service");
const decorator_1 = require("../common/decorator");
const dto_1 = require("./dto");
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    async socialLogin(dto) {
        return this.authService.socialLogin(dto);
    }
    async refreshToken(dto) {
        return this.authService.refreshToken(dto.refreshToken);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, decorator_1.Public)(true),
    (0, common_1.Post)('social'),
    (0, swagger_1.ApiOperation)({
        summary: '소셜 로그인',
        description: '카카오, 네이버, 구글, 애플 소셜 로그인을 처리합니다.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: '로그인 성공',
        type: dto_1.SocialLoginResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: '토큰 검증 실패' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.SocialLoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "socialLogin", null);
__decorate([
    (0, decorator_1.Public)(true),
    (0, common_1.Post)('refresh'),
    (0, swagger_1.ApiOperation)({
        summary: '토큰 갱신',
        description: 'Refresh Token을 사용하여 새로운 Access Token을 발급합니다.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: '토큰 갱신 성공',
        type: dto_1.TokenResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: '유효하지 않은 토큰' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.RefreshTokenDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refreshToken", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    (0, swagger_1.ApiTags)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map