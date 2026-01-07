import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import * as jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';

import { User, Role, SocialProvider } from '../user/entity/user.entity';
import { envVariableKeys } from '../common/const/env.const';
import {
  SocialLoginDto,
  SocialLoginResponseDto,
  TokenResponseDto,
} from './dto';

interface SocialUserInfo {
  socialId: string;
  email?: string;
  nickname?: string;
  profileImageUrl?: string;
}

interface JwtPayload {
  sub: number;
  role: string;
  socialId: string;
  type: 'access' | 'refresh';
  iat?: number;
  exp?: number;
}

interface AppleIdTokenPayload {
  sub: string;
  email?: string;
  email_verified?: boolean;
  iss: string;
  aud: string;
  exp: number;
  iat: number;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Social Login
   */
  async socialLogin(dto: SocialLoginDto): Promise<SocialLoginResponseDto> {
    const { provider, accessToken, idToken } = dto;

    // Verify token with social provider
    const socialUserInfo = await this.verifySocialToken(
      provider,
      accessToken,
      idToken,
    );

    // Find or create user
    let user = await this.userRepository.findOne({
      where: {
        socialId: socialUserInfo.socialId,
        socialProvider: provider,
      },
    });

    const isNewUser = !user;

    if (!user) {
      user = await this.createSocialUser(provider, socialUserInfo);
    } else {
      // Update last login time
      user.lastLoginAt = new Date();
      await this.userRepository.save(user);
    }

    // Check if user is blocked
    if (user.blockedAt) {
      throw new UnauthorizedException('차단된 계정입니다.');
    }

    // Issue JWT tokens
    const tokens = await this.issueTokenPair(user);

    return {
      ...tokens,
      userId: user.id,
      isNewUser,
    };
  }

  /**
   * Refresh Token
   */
  async refreshToken(refreshToken: string): Promise<TokenResponseDto> {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.getOrThrow<string>(
          envVariableKeys.refreshTokenSecret,
        ),
      });

      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('유효하지 않은 토큰입니다.');
      }

      const user = await this.userRepository.findOne({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('사용자를 찾을 수 없습니다.');
      }

      if (user.blockedAt) {
        throw new UnauthorizedException('차단된 계정입니다.');
      }

      return this.issueTokenPair(user);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('토큰이 만료되었습니다.');
      }
      throw new UnauthorizedException('유효하지 않은 토큰입니다.');
    }
  }

  /**
   * Verify Bearer Token (for WebSocket)
   */
  async verifyBearerToken(
    token: string,
    isRefreshToken: boolean,
  ): Promise<JwtPayload> {
    const secret = this.configService.getOrThrow<string>(
      isRefreshToken
        ? envVariableKeys.refreshTokenSecret
        : envVariableKeys.accessTokenSecret,
    );

    return this.jwtService.verifyAsync<JwtPayload>(token, { secret });
  }

  /**
   * Parse Bearer Token from header
   */
  parseBearerToken(authHeader: string): string | null {
    if (!authHeader) return null;

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
      return null;
    }

    return parts[1];
  }

  // ==================== Private Methods ====================

  private async verifySocialToken(
    provider: SocialProvider,
    accessToken: string,
    idToken?: string,
  ): Promise<SocialUserInfo> {
    switch (provider) {
      case SocialProvider.kakao:
        return this.verifyKakaoToken(accessToken);
      case SocialProvider.naver:
        return this.verifyNaverToken(accessToken);
      case SocialProvider.google:
        return this.verifyGoogleToken(accessToken);
      case SocialProvider.apple:
        return this.verifyAppleToken(idToken || accessToken);
      default:
        throw new BadRequestException('지원하지 않는 소셜 로그인입니다.');
    }
  }

  private async verifyKakaoToken(accessToken: string): Promise<SocialUserInfo> {
    try {
      const response = await axios.get('https://kapi.kakao.com/v2/user/me', {
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
    } catch (error) {
      throw new UnauthorizedException('카카오 토큰 검증에 실패했습니다.');
    }
  }

  private async verifyNaverToken(accessToken: string): Promise<SocialUserInfo> {
    try {
      const response = await axios.get('https://openapi.naver.com/v1/nid/me', {
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
    } catch (error) {
      throw new UnauthorizedException('네이버 토큰 검증에 실패했습니다.');
    }
  }

  private async verifyGoogleToken(
    accessToken: string,
  ): Promise<SocialUserInfo> {
    try {
      const response = await axios.get(
        'https://www.googleapis.com/oauth2/v2/userinfo',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const data = response.data;

      return {
        socialId: `google_${data.id}`,
        email: data.email,
        nickname: data.name,
        profileImageUrl: data.picture,
      };
    } catch (error) {
      throw new UnauthorizedException('구글 토큰 검증에 실패했습니다.');
    }
  }

  private async verifyAppleToken(idToken: string): Promise<SocialUserInfo> {
    try {
      // JWKS client for Apple's public keys
      const client = jwksClient({
        jwksUri: 'https://appleid.apple.com/auth/keys',
        cache: true,
        cacheMaxAge: 86400000, // 24 hours
      });

      // Get signing key
      const getKey = (header: jwt.JwtHeader, callback: jwt.SigningKeyCallback) => {
        client.getSigningKey(header.kid, (err, key) => {
          if (err) {
            callback(err);
            return;
          }
          const signingKey = key?.getPublicKey();
          callback(null, signingKey);
        });
      };

      // Verify token signature
      const decoded = await new Promise<AppleIdTokenPayload>(
        (resolve, reject) => {
          jwt.verify(
            idToken,
            getKey,
            {
              algorithms: ['RS256'],
              issuer: 'https://appleid.apple.com',
            },
            (err, decoded) => {
              if (err) reject(err);
              else resolve(decoded as AppleIdTokenPayload);
            },
          );
        },
      );

      if (!decoded || !decoded.sub) {
        throw new UnauthorizedException('애플 토큰 검증에 실패했습니다.');
      }

      return {
        socialId: `apple_${decoded.sub}`,
        email: decoded.email,
        nickname: undefined,
        profileImageUrl: undefined,
      };
    } catch (error) {
      throw new UnauthorizedException('애플 토큰 검증에 실패했습니다.');
    }
  }

  private async createSocialUser(
    provider: SocialProvider,
    info: SocialUserInfo,
  ): Promise<User> {
    const user = this.userRepository.create({
      socialId: info.socialId,
      socialProvider: provider,
      email: info.email,
      nickname: info.nickname,
      profileImageUrl: info.profileImageUrl,
      role: Role.user,
      lastLoginAt: new Date(),
    });

    return this.userRepository.save(user);
  }

  private async issueTokenPair(user: User): Promise<TokenResponseDto> {
    const payload = {
      sub: user.id,
      role: user.role,
      socialId: user.socialId,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { ...payload, type: 'access' },
        {
          secret: this.configService.getOrThrow<string>(
            envVariableKeys.accessTokenSecret,
          ),
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        { ...payload, type: 'refresh' },
        {
          secret: this.configService.getOrThrow<string>(
            envVariableKeys.refreshTokenSecret,
          ),
          expiresIn: '7d',
        },
      ),
    ]);

    return { accessToken, refreshToken };
  }
}
