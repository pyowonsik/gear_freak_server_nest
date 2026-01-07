import { BaseTable } from '../../common/entity/base-table.entity';
export declare enum Role {
    admin = 0,
    user = 1
}
export declare enum SocialProvider {
    kakao = "kakao",
    naver = "naver",
    google = "google",
    apple = "apple",
    email = "email"
}
export declare class User extends BaseTable {
    id: number;
    socialId: string;
    socialProvider: SocialProvider;
    email: string;
    password: string;
    nickname: string;
    profileImageUrl: string;
    bio: string;
    role: Role;
    lastLoginAt: Date;
    blockedAt: Date;
    blockedReason: string;
    withdrawalDate: Date;
}
