import { SocialProvider } from '../../user/entity/user.entity';
export declare class SocialLoginDto {
    provider: SocialProvider;
    accessToken: string;
    idToken?: string;
}
export declare class SocialLoginResponseDto {
    accessToken: string;
    refreshToken: string;
    userId: number;
    isNewUser: boolean;
}
