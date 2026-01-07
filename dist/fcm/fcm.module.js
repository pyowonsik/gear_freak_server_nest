"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FcmModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const fcm_controller_1 = require("./fcm.controller");
const fcm_service_1 = require("./fcm.service");
const fcm_token_entity_1 = require("./entity/fcm-token.entity");
let FcmModule = class FcmModule {
};
exports.FcmModule = FcmModule;
exports.FcmModule = FcmModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([fcm_token_entity_1.FcmToken]), config_1.ConfigModule],
        controllers: [fcm_controller_1.FcmController],
        providers: [fcm_service_1.FcmService],
        exports: [fcm_service_1.FcmService],
    })
], FcmModule);
//# sourceMappingURL=fcm.module.js.map