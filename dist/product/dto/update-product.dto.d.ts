import { ProductCategory, ProductCondition, ProductStatus, TradeMethod } from '../entity/product.entity';
export declare class UpdateProductDto {
    title?: string;
    category?: ProductCategory;
    price?: number;
    condition?: ProductCondition;
    description?: string;
    tradeMethod?: TradeMethod;
    baseAddress?: string;
    detailAddress?: string;
    imageUrls?: string[];
}
export declare class UpdateProductStatusDto {
    status: ProductStatus;
}
