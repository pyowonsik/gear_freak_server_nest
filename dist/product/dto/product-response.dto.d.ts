import { ProductCategory, ProductCondition, ProductStatus, TradeMethod } from '../entity/product.entity';
export declare class ProductSellerDto {
    id: number;
    nickname?: string;
    profileImageUrl?: string;
}
export declare class ProductResponseDto {
    id: number;
    title: string;
    category: ProductCategory;
    price: number;
    condition: ProductCondition;
    description: string;
    tradeMethod: TradeMethod;
    baseAddress?: string;
    detailAddress?: string;
    imageUrls: string[];
    viewCount: number;
    favoriteCount: number;
    chatCount: number;
    status: ProductStatus;
    createdAt: Date;
    updatedAt: Date;
    seller: ProductSellerDto;
    isFavorite?: boolean;
}
export declare class ProductListItemDto {
    id: number;
    title: string;
    category: ProductCategory;
    price: number;
    status: ProductStatus;
    thumbnailUrl?: string;
    favoriteCount: number;
    chatCount: number;
    createdAt: Date;
    isFavorite?: boolean;
}
export declare class ProductStatsDto {
    sellingCount: number;
    soldCount: number;
    reviewCount: number;
    averageRating: number;
}
