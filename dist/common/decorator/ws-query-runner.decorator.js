"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WsQueryRunner = void 0;
const common_1 = require("@nestjs/common");
exports.WsQueryRunner = (0, common_1.createParamDecorator)((data, context) => {
    const client = context.switchToWs().getClient();
    if (!client?.data?.queryRunner) {
        throw new common_1.InternalServerErrorException('WsQueryRunner decorator requires WsTransactionInterceptor to be applied.');
    }
    return client.data.queryRunner;
});
//# sourceMappingURL=ws-query-runner.decorator.js.map