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
exports.FcmToken = exports.DeviceType = void 0;
const typeorm_1 = require("typeorm");
const base_table_entity_1 = require("../../common/entity/base-table.entity");
const user_entity_1 = require("../../user/entity/user.entity");
var DeviceType;
(function (DeviceType) {
    DeviceType["ios"] = "ios";
    DeviceType["android"] = "android";
    DeviceType["web"] = "web";
})(DeviceType || (exports.DeviceType = DeviceType = {}));
let FcmToken = class FcmToken extends base_table_entity_1.BaseTable {
    id;
    userId;
    user;
    token;
    deviceType;
    lastUsedAt;
};
exports.FcmToken = FcmToken;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], FcmToken.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], FcmToken.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], FcmToken.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], FcmToken.prototype, "token", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: DeviceType }),
    __metadata("design:type", String)
], FcmToken.prototype, "deviceType", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], FcmToken.prototype, "lastUsedAt", void 0);
exports.FcmToken = FcmToken = __decorate([
    (0, typeorm_1.Entity)(),
    (0, typeorm_1.Unique)(['userId', 'token'])
], FcmToken);
//# sourceMappingURL=fcm-token.entity.js.map