"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const axios_1 = __importDefault(require("axios"));
const jwt = __importStar(require("jsonwebtoken"));
const jwks_rsa_1 = __importDefault(require("jwks-rsa"));
const user_entity_1 = require("../user/entity/user.entity");
const env_const_1 = require("../common/const/env.const");
let AuthService = class AuthService {
    userRepository;
    jwtService;
    configService;
    constructor(userRepository, jwtService, configService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async socialLogin(dto) {
        const { provider, accessToken, idToken } = dto;
        const socialUserInfo = await this.verifySocialToken(provider, accessToken, idToken);
        let user = await this.userRepository.findOne({
            where: {
                socialId: socialUserInfo.socialId,
                socialProvider: provider,
            },
        });
        const isNewUser = !user;
        if (!user) {
            user = await this.createSocialUser(provider, socialUserInfo);
        }
        else {
            user.lastLoginAt = new Date();
            await this.userRepository.save(user);
        }
        if (user.blockedAt) {
            throw new common_1.UnauthorizedException('차단된 계정입니다.');
        }
        const tokens = await this.issueTokenPair(user);
        return {
            ...tokens,
            userId: user.id,
            isNewUser,
        };
    }
    async refreshToken(refreshToken) {
        try {
            const payload = await this.jwtService.verifyAsync(refreshToken, {
                secret: this.configService.getOrThrow(env_const_1.envVariableKeys.refreshTokenSecret),
            });
            if (payload.type !== 'refresh') {
                throw new common_1.UnauthorizedException('유효하지 않은 토큰입니다.');
            }
            const user = await this.userRepository.findOne({
                where: { id: payload.sub },
            });
            if (!user) {
                throw new common_1.UnauthorizedException('사용자를 찾을 수 없습니다.');
            }
            if (user.blockedAt) {
                throw new common_1.UnauthorizedException('차단된 계정입니다.');
            }
            return this.issueTokenPair(user);
        }
        catch (error) {
            if (error.name === 'TokenExpiredError') {
                throw new common_1.UnauthorizedException('토큰이 만료되었습니다.');
            }
            throw new common_1.UnauthorizedException('유효하지 않은 토큰입니다.');
        }
    }
    async verifyBearerToken(token, isRefreshToken) {
        const secret = this.configService.getOrThrow(isRefreshToken
            ? env_const_1.envVariableKeys.refreshTokenSecret
            : env_const_1.envVariableKeys.accessTokenSecret);
        return this.jwtService.verifyAsync(token, { secret });
    }
    parseBearerToken(authHeader) {
        if (!authHeader)
            return null;
        const parts = authHeader.split(' ');
        if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
            return null;
        }
        return parts[1];
    }
    async verifySocialToken(provider, accessToken, idToken) {
        switch (provider) {
            case user_entity_1.SocialProvider.kakao:
                return this.verifyKakaoToken(accessToken);
            case user_entity_1.SocialProvider.naver:
                return this.verifyNaverToken(accessToken);
            case user_entity_1.SocialProvider.google:
                return this.verifyGoogleToken(accessToken);
            case user_entity_1.SocialProvider.apple:
                return this.verifyAppleToken(idToken || accessToken);
            default:
                throw new common_1.BadRequestException('지원하지 않는 소셜 로그인입니다.');
        }
    }
    async verifyKakaoToken(accessToken) {
        try {
            const response = await axios_1.default.get('https://kapi.kakao.com/v2/user/me', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            const data = response.data;
            const kakaoAccount = data.kakao_account || {};
            const profile = kakaoAccount.profile || {};
            return {
                socialId: `kakao_${data.id}`,
                email: kakaoAccount.email,
                nickname: profile.nickname,
                profileImageUrl: profile.profile_image_url,
            };
        }
        catch (error) {
            throw new common_1.UnauthorizedException('카카오 토큰 검증에 실패했습니다.');
        }
    }
    async verifyNaverToken(accessToken) {
        try {
            const response = await axios_1.default.get('https://openapi.naver.com/v1/nid/me', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            const data = response.data.response;
            return {
                socialId: `naver_${data.id}`,
                email: data.email,
                nickname: data.nickname || data.name,
                profileImageUrl: data.profile_image,
            };
        }
        catch (error) {
            throw new common_1.UnauthorizedException('네이버 토큰 검증에 실패했습니다.');
        }
    }
    async verifyGoogleToken(accessToken) {
        try {
            const response = await axios_1.default.get('https://www.googleapis.com/oauth2/v2/userinfo', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            const data = response.data;
            return {
                socialId: `google_${data.id}`,
                email: data.email,
                nickname: data.name,
                profileImageUrl: data.picture,
            };
        }
        catch (error) {
            throw new common_1.UnauthorizedException('구글 토큰 검증에 실패했습니다.');
        }
    }
    async verifyAppleToken(idToken) {
        try {
            const client = (0, jwks_rsa_1.default)({
                jwksUri: 'https://appleid.apple.com/auth/keys',
                cache: true,
                cacheMaxAge: 86400000,
            });
            const getKey = (header, callback) => {
                client.getSigningKey(header.kid, (err, key) => {
                    if (err) {
                        callback(err);
                        return;
                    }
                    const signingKey = key?.getPublicKey();
                    callback(null, signingKey);
                });
            };
            const decoded = await new Promise((resolve, reject) => {
                jwt.verify(idToken, getKey, {
                    algorithms: ['RS256'],
                    issuer: 'https://appleid.apple.com',
                }, (err, decoded) => {
                    if (err)
                        reject(err);
                    else
                        resolve(decoded);
                });
            });
            if (!decoded || !decoded.sub) {
                throw new common_1.UnauthorizedException('애플 토큰 검증에 실패했습니다.');
            }
            return {
                socialId: `apple_${decoded.sub}`,
                email: decoded.email,
                nickname: undefined,
                profileImageUrl: undefined,
            };
        }
        catch (error) {
            throw new common_1.UnauthorizedException('애플 토큰 검증에 실패했습니다.');
        }
    }
    async createSocialUser(provider, info) {
        const user = this.userRepository.create({
            socialId: info.socialId,
            socialProvider: provider,
            email: info.email,
            nickname: info.nickname,
            profileImageUrl: info.profileImageUrl,
            role: user_entity_1.Role.user,
            lastLoginAt: new Date(),
        });
        return this.userRepository.save(user);
    }
    async issueTokenPair(user) {
        const payload = {
            sub: user.id,
            role: user.role,
            socialId: user.socialId,
        };
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync({ ...payload, type: 'access' }, {
                secret: this.configService.getOrThrow(env_const_1.envVariableKeys.accessTokenSecret),
                expiresIn: '15m',
            }),
            this.jwtService.signAsync({ ...payload, type: 'refresh' }, {
                secret: this.configService.getOrThrow(env_const_1.envVariableKeys.refreshTokenSecret),
                expiresIn: '7d',
            }),
        ]);
        return { accessToken, refreshToken };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map