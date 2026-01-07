import { NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
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
export declare class BearerTokenMiddleware implements NestMiddleware {
    private readonly configService;
    private readonly jwtService;
    constructor(configService: ConfigService, jwtService: JwtService);
    use(req: RequestWithUser, res: Response, next: NextFunction): Promise<void>;
    private validateBearerToken;
}
export {};
