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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocialLoginResponseDto = exports.SocialLoginDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const user_entity_1 = require("../../user/entity/user.entity");
class SocialLoginDto {
    provider;
    accessToken;
    idToken;
}
exports.SocialLoginDto = SocialLoginDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '소셜 로그인 제공자',
        enum: user_entity_1.SocialProvider,
        example: user_entity_1.SocialProvider.kakao,
    }),
    (0, class_validator_1.IsEnum)(user_entity_1.SocialProvider),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SocialLoginDto.prototype, "provider", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '소셜 로그인 액세스 토큰',
        example: 'access_token_from_social_provider',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SocialLoginDto.prototype, "accessToken", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Apple 로그인 시 필요한 ID Token',
        example: 'apple_id_token',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SocialLoginDto.prototype, "idToken", void 0);
class SocialLoginResponseDto {
    accessToken;
    refreshToken;
    userId;
    isNewUser;
}
exports.SocialLoginResponseDto = SocialLoginResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'JWT Access Token' }),
    __metadata("design:type", String)
], SocialLoginResponseDto.prototype, "accessToken", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'JWT Refresh Token' }),
    __metadata("design:type", String)
], SocialLoginResponseDto.prototype, "refreshToken", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '사용자 ID' }),
    __metadata("design:type", Number)
], SocialLoginResponseDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '신규 가입 여부' }),
    __metadata("design:type", Boolean)
], SocialLoginResponseDto.prototype, "isNewUser", void 0);
//# sourceMappingURL=social-login.dto.js.map