import { AuthService } from './auth.service';
import { SocialLoginDto, SocialLoginResponseDto, RefreshTokenDto, TokenResponseDto } from './dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    socialLogin(dto: SocialLoginDto): Promise<SocialLoginResponseDto>;
    refreshToken(dto: RefreshTokenDto): Promise<TokenResponseDto>;
}
