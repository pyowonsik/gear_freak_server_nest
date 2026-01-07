import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Public } from '../decorator/public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Check if route is marked as public
    const isPublic = this.reflector.get(Public, context.getHandler());

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    // Check if user exists
    if (!request.user) {
      throw new UnauthorizedException('인증 토큰이 필요합니다.');
    }

    // Check if token type is access
    if (request.user.type !== 'access') {
      throw new UnauthorizedException(
        '유효하지 않은 토큰 타입입니다. Access Token이 필요합니다.',
      );
    }

    return true;
  }
}
