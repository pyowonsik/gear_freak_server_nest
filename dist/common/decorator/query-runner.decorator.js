"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryRunner = void 0;
const common_1 = require("@nestjs/common");
exports.QueryRunner = (0, common_1.createParamDecorator)((data, context) => {
    const request = context.switchToHttp().getRequest();
    if (!request?.queryRunner) {
        throw new common_1.InternalServerErrorException('QueryRunner decorator requires TransactionInterceptor to be applied.');
    }
    return request.queryRunner;
});
//# sourceMappingURL=query-runner.decorator.js.map