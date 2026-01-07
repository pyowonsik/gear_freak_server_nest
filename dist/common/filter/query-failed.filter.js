"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryFailedExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
let QueryFailedExceptionFilter = class QueryFailedExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const request = ctx.getRequest();
        const response = ctx.getResponse();
        let message = '데이터베이스 에러가 발생했습니다.';
        let statusCode = 400;
        if (exception.message.includes('duplicate key')) {
            message = '중복된 데이터가 존재합니다.';
            statusCode = 409;
        }
        else if (exception.message.includes('violates foreign key')) {
            message = '참조하는 데이터가 존재하지 않습니다.';
            statusCode = 400;
        }
        else if (exception.message.includes('violates not-null')) {
            message = '필수 데이터가 누락되었습니다.';
            statusCode = 400;
        }
        response.status(statusCode).json({
            statusCode,
            timestamp: new Date().toISOString(),
            path: request.url,
            message,
        });
    }
};
exports.QueryFailedExceptionFilter = QueryFailedExceptionFilter;
exports.QueryFailedExceptionFilter = QueryFailedExceptionFilter = __decorate([
    (0, common_1.Catch)(typeorm_1.QueryFailedError)
], QueryFailedExceptionFilter);
//# sourceMappingURL=query-failed.filter.js.map