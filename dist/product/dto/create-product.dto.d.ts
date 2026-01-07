import { ProductCategory, ProductCondition, TradeMethod } from '../entity/product.entity';
export declare class CreateProductDto {
    title: string;
    category: ProductCategory;
    price: number;
    condition: ProductCondition;
    description: string;
    tradeMethod: TradeMethod;
    baseAddress?: string;
    detailAddress?: string;
    imageUrls?: string[];
}
