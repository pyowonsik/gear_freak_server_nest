export declare class UserResponseDto {
    id: number;
    email?: string;
    nickname?: string;
    profileImageUrl?: string;
    bio?: string;
    createdAt: Date;
}
export declare class UserStatsResponseDto {
    sellingCount: number;
    soldCount: number;
    reviewCount: number;
    averageRating: number;
}
