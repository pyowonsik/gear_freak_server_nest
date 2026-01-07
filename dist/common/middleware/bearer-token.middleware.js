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
exports.BearerTokenMiddleware = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const env_const_1 = require("../const/env.const");
let BearerTokenMiddleware = class BearerTokenMiddleware {
    configService;
    jwtService;
    constructor(configService, jwtService) {
        this.configService = configService;
        this.jwtService = jwtService;
    }
    async use(req, res, next) {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            next();
            return;
        }
        const token = this.validateBearerToken(authHeader);
        if (!token) {
            next();
            return;
        }
        try {
            const decodedPayload = this.jwtService.decode(token);
            if (!decodedPayload || typeof decodedPayload !== 'object') {
                next();
                return;
            }
            const secretKey = decodedPayload.type === 'refresh'
                ? env_const_1.envVariableKeys.refreshTokenSecret
                : env_const_1.envVariableKeys.accessTokenSecret;
            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.configService.getOrThrow(secretKey),
            });
            req.user = payload;
            next();
        }
        catch (e) {
            if (e.name === 'TokenExpiredError') {
                throw new common_1.UnauthorizedException('토큰이 만료되었습니다.');
            }
            next();
        }
    }
    validateBearerToken(authHeader) {
        const splitHeader = authHeader.split(' ');
        if (splitHeader.length !== 2) {
            return null;
        }
        const [type, token] = splitHeader;
        if (type.toLowerCase() !== 'bearer') {
            return null;
        }
        return token;
    }
};
exports.BearerTokenMiddleware = BearerTokenMiddleware;
exports.BearerTokenMiddleware = BearerTokenMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        jwt_1.JwtService])
], BearerTokenMiddleware);
//# sourceMappingURL=bearer-token.middleware.js.map