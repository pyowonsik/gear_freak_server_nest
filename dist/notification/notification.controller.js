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
exports.NotificationController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const notification_service_1 = require("./notification.service");
const decorator_1 = require("../common/decorator");
const dto_1 = require("../common/dto");
let NotificationController = class NotificationController {
    notificationService;
    constructor(notificationService) {
        this.notificationService = notificationService;
    }
    async getNotifications(userId, dto) {
        return this.notificationService.getNotifications(userId, dto.page, dto.limit);
    }
    async markAsRead(userId, notificationId) {
        await this.notificationService.markAsRead(userId, notificationId);
        return { message: '읽음 처리되었습니다.' };
    }
    async deleteNotification(userId, notificationId) {
        await this.notificationService.deleteNotification(userId, notificationId);
        return { message: '알림이 삭제되었습니다.' };
    }
    async getUnreadCount(userId) {
        const unreadCount = await this.notificationService.getUnreadCount(userId);
        return { unreadCount };
    }
    async markAllAsRead(userId) {
        await this.notificationService.markAllAsRead(userId);
        return { message: '모든 알림이 읽음 처리되었습니다.' };
    }
};
exports.NotificationController = NotificationController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: '알림 목록 조회',
        description: '알림 목록을 조회합니다.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '알림 목록',
    }),
    __param(0, (0, decorator_1.UserId)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, dto_1.PagePaginationDto]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "getNotifications", null);
__decorate([
    (0, common_1.Patch)(':id/read'),
    (0, swagger_1.ApiOperation)({
        summary: '알림 읽음 처리',
        description: '알림을 읽음 처리합니다.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '읽음 처리 완료' }),
    __param(0, (0, decorator_1.UserId)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "markAsRead", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: '알림 삭제',
        description: '알림을 삭제합니다.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '삭제 완료' }),
    __param(0, (0, decorator_1.UserId)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "deleteNotification", null);
__decorate([
    (0, common_1.Get)('unread-count'),
    (0, swagger_1.ApiOperation)({
        summary: '안읽은 알림 수 조회',
        description: '안읽은 알림 수를 조회합니다.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '안읽은 알림 수',
    }),
    __param(0, (0, decorator_1.UserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "getUnreadCount", null);
__decorate([
    (0, common_1.Post)('read-all'),
    (0, swagger_1.ApiOperation)({
        summary: '모든 알림 읽음 처리',
        description: '모든 알림을 읽음 처리합니다.',
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: '읽음 처리 완료' }),
    __param(0, (0, decorator_1.UserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "markAllAsRead", null);
exports.NotificationController = NotificationController = __decorate([
    (0, common_1.Controller)('notification'),
    (0, swagger_1.ApiTags)('notification'),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [notification_service_1.NotificationService])
], NotificationController);
//# sourceMappingURL=notification.controller.js.map