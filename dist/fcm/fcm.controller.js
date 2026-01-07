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
exports.FcmController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const fcm_service_1 = require("./fcm.service");
const decorator_1 = require("../common/decorator");
const dto_1 = require("./dto");
let FcmController = class FcmController {
    fcmService;
    constructor(fcmService) {
        this.fcmService = fcmService;
    }
    async registerToken(userId, dto) {
        await this.fcmService.registerToken(userId, dto.token, dto.deviceType);
        return { message: 'FCM 토큰이 등록되었습니다.' };
    }
    async deleteToken(userId, dto) {
        await this.fcmService.deleteToken(userId, dto.token);
        return { message: 'FCM 토큰이 삭제되었습니다.' };
    }
};
exports.FcmController = FcmController;
__decorate([
    (0, common_1.Post)('token'),
    (0, swagger_1.ApiOperation)({
        summary: 'FCM 토큰 등록',
        description: '디바이스의 FCM 토큰을 등록합니다.',
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'FCM 토큰 등록 성공' }),
    __param(0, (0, decorator_1.UserId)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, dto_1.RegisterFcmTokenDto]),
    __metadata("design:returntype", Promise)
], FcmController.prototype, "registerToken", null);
__decorate([
    (0, common_1.Delete)('token'),
    (0, swagger_1.ApiOperation)({
        summary: 'FCM 토큰 삭제',
        description: '디바이스의 FCM 토큰을 삭제합니다.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'FCM 토큰 삭제 성공' }),
    __param(0, (0, decorator_1.UserId)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, dto_1.DeleteFcmTokenDto]),
    __metadata("design:returntype", Promise)
], FcmController.prototype, "deleteToken", null);
exports.FcmController = FcmController = __decorate([
    (0, common_1.Controller)('fcm'),
    (0, swagger_1.ApiTags)('fcm'),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [fcm_service_1.FcmService])
], FcmController);
//# sourceMappingURL=fcm.controller.js.map