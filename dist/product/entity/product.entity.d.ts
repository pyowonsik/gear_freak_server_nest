import { BaseTable } from '../../common/entity/base-table.entity';
import { User } from '../../user/entity/user.entity';
export declare enum ProductCategory {
    equipment = "equipment",
    supplement = "supplement",
    clothing = "clothing",
    shoes = "shoes",
    etc = "etc"
}
export declare enum ProductCondition {
    brandNew = "brandNew",
    usedExcellent = "usedExcellent",
    usedGood = "usedGood",
    usedFair = "usedFair"
}
export declare enum TradeMethod {
    direct = "direct",
    delivery = "delivery",
    both = "both"
}
export declare enum ProductStatus {
    selling = "selling",
    reserved = "reserved",
    sold = "sold"
}
export declare class Product extends BaseTable {
    id: number;
    sellerId: number;
    seller: User;
    title: string;
    category: ProductCategory;
    price: number;
    condition: ProductCondition;
    description: string;
    tradeMethod: TradeMethod;
    baseAddress: string;
    detailAddress: string;
    imageUrls: string[];
    viewCount: number;
    favoriteCount: number;
    chatCount: number;
    status: ProductStatus;
}
