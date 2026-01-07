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
exports.DeleteFcmTokenDto = exports.RegisterFcmTokenDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const fcm_token_entity_1 = require("../entity/fcm-token.entity");
class RegisterFcmTokenDto {
    token;
    deviceType;
}
exports.RegisterFcmTokenDto = RegisterFcmTokenDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'FCM 토큰',
        example: 'fCkXYZ123...',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RegisterFcmTokenDto.prototype, "token", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '디바이스 타입',
        enum: fcm_token_entity_1.DeviceType,
        example: fcm_token_entity_1.DeviceType.ios,
    }),
    (0, class_validator_1.IsEnum)(fcm_token_entity_1.DeviceType),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RegisterFcmTokenDto.prototype, "deviceType", void 0);
class DeleteFcmTokenDto {
    token;
}
exports.DeleteFcmTokenDto = DeleteFcmTokenDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '삭제할 FCM 토큰',
        example: 'fCkXYZ123...',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], DeleteFcmTokenDto.prototype, "token", void 0);
//# sourceMappingURL=fcm-token.dto.js.map