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
exports.TransactionInterceptor = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const typeorm_1 = require("typeorm");
let TransactionInterceptor = class TransactionInterceptor {
    dataSource;
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        request.queryRunner = queryRunner;
        return next.handle().pipe((0, rxjs_1.catchError)(async (e) => {
            await queryRunner.rollbackTransaction();
            await queryRunner.release();
            throw e;
        }), (0, rxjs_1.tap)(async () => {
            await queryRunner.commitTransaction();
            await queryRunner.release();
        }));
    }
};
exports.TransactionInterceptor = TransactionInterceptor;
exports.TransactionInterceptor = TransactionInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], TransactionInterceptor);
//# sourceMappingURL=transaction.interceptor.js.map