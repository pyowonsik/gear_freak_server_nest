import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
import { envVariableKeys } from '../const/env.const';

interface JwtPayload {
  sub: number;
  role: string;
  socialId: string;
  type: 'access' | 'refresh';
  iat?: number;
  exp?: number;
}

interface RequestWithUser extends Request {
  user?: JwtPayload;
}

@Injectable()
export class BearerTokenMiddleware implements NestMiddleware {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async use(req: RequestWithUser, res: Response, next: NextFunction) {
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

      const secretKey =
        decodedPayload.type === 'refresh'
          ? envVariableKeys.refreshTokenSecret
          : envVariableKeys.accessTokenSecret;

      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: this.configService.getOrThrow<string>(secretKey),
      });

      req.user = payload;
      next();
    } catch (e) {
      if (e.name === 'TokenExpiredError') {
        throw new UnauthorizedException('토큰이 만료되었습니다.');
      }
      next();
    }
  }

  private validateBearerToken(authHeader: string): string | null {
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
}
