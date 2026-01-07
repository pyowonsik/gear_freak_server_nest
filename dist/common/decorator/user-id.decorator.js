"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserId = void 0;
const common_1 = require("@nestjs/common");
exports.UserId = (0, common_1.createParamDecorator)((data, context) => {
    const request = context.switchToHttp().getRequest();
    if (!request?.user?.sub) {
        throw new common_1.InternalServerErrorException('UserId decorator requires authentication. Ensure route is protected.');
    }
    return request.user.sub;
});
//# sourceMappingURL=user-id.decorator.js.map