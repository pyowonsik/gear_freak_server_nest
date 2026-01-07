import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from '../user/entity/user.entity';
import { SocialLoginDto, SocialLoginResponseDto, TokenResponseDto } from './dto';
interface JwtPayload {
    sub: number;
    role: string;
    socialId: string;
    type: 'access' | 'refresh';
    iat?: number;
    exp?: number;
}
export declare class AuthService {
    private readonly userRepository;
    private readonly jwtService;
    private readonly configService;
    constructor(userRepository: Repository<User>, jwtService: JwtService, configService: ConfigService);
    socialLogin(dto: SocialLoginDto): Promise<SocialLoginResponseDto>;
    refreshToken(refreshToken: string): Promise<TokenResponseDto>;
    verifyBearerToken(token: string, isRefreshToken: boolean): Promise<JwtPayload>;
    parseBearerToken(authHeader: string): string | null;
    private verifySocialToken;
    private verifyKakaoToken;
    private verifyNaverToken;
    private verifyGoogleToken;
    private verifyAppleToken;
    private createSocialUser;
    private issueTokenPair;
}
export {};
