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
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const notification_entity_1 = require("./entity/notification.entity");
const dto_1 = require("../common/dto");
const fcm_service_1 = require("../fcm/fcm.service");
let NotificationService = class NotificationService {
    notificationRepository;
    fcmService;
    constructor(notificationRepository, fcmService) {
        this.notificationRepository = notificationRepository;
        this.fcmService = fcmService;
    }
    async createNotification(params) {
        const notification = this.notificationRepository.create({
            userId: params.userId,
            notificationType: params.type,
            title: params.title,
            body: params.body,
            data: params.data,
            referenceId: params.referenceId,
            referenceType: params.referenceType,
        });
        const savedNotification = await this.notificationRepository.save(notification);
        if (params.sendPush !== false) {
            await this.fcmService.sendNotificationToUser({
                userId: params.userId,
                title: params.title,
                body: params.body,
                data: {
                    type: params.type,
                    notificationId: savedNotification.id.toString(),
                    ...Object.fromEntries(Object.entries(params.data || {}).map(([k, v]) => [k, String(v)])),
                },
            });
        }
        return savedNotification;
    }
    async getNotifications(userId, page = 1, limit = 20) {
        const offset = (page - 1) * limit;
        const [notifications, total] = await this.notificationRepository.findAndCount({
            where: { userId },
            order: { createdAt: 'DESC' },
            skip: offset,
            take: limit,
        });
        const items = notifications.map((n) => this.toNotificationResponse(n));
        return new dto_1.PaginationResponseDto(items, total, page, limit);
    }
    async markAsRead(userId, notificationId) {
        const notification = await this.notificationRepository.findOne({
            where: { id: notificationId, userId },
        });
        if (!notification) {
            throw new common_1.NotFoundException('알림을 찾을 수 없습니다.');
        }
        notification.isRead = true;
        notification.readAt = new Date();
        await this.notificationRepository.save(notification);
    }
    async deleteNotification(userId, notificationId) {
        const notification = await this.notificationRepository.findOne({
            where: { id: notificationId, userId },
        });
        if (!notification) {
            throw new common_1.NotFoundException('알림을 찾을 수 없습니다.');
        }
        await this.notificationRepository.remove(notification);
    }
    async getUnreadCount(userId) {
        return this.notificationRepository.count({
            where: { userId, isRead: false },
        });
    }
    async markAllAsRead(userId) {
        await this.notificationRepository.update({ userId, isRead: false }, { isRead: true, readAt: new Date() });
    }
    toNotificationResponse(notification) {
        return {
            id: notification.id,
            notificationType: notification.notificationType,
            title: notification.title,
            body: notification.body,
            data: notification.data,
            isRead: notification.isRead,
            readAt: notification.readAt,
            createdAt: notification.createdAt,
        };
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(notification_entity_1.Notification)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        fcm_service_1.FcmService])
], NotificationService);
//# sourceMappingURL=notification.service.js.map