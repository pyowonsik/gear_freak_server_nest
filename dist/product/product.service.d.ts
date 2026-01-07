import { Repository, QueryRunner } from 'typeorm';
import { Product } from './entity/product.entity';
import { Favorite } from './entity/favorite.entity';
import { ProductView } from './entity/product-view.entity';
import { ProductReport } from './entity/product-report.entity';
import { CreateProductDto, UpdateProductDto, UpdateProductStatusDto, GetProductsDto, ProductResponseDto, ProductListItemDto, ProductStatsDto, CreateProductReportDto } from './dto';
import { PaginationResponseDto } from '../common/dto';
export declare class ProductService {
    private readonly productRepository;
    private readonly favoriteRepository;
    private readonly productViewRepository;
    private readonly productReportRepository;
    constructor(productRepository: Repository<Product>, favoriteRepository: Repository<Favorite>, productViewRepository: Repository<ProductView>, productReportRepository: Repository<ProductReport>);
    createProduct(userId: number, dto: CreateProductDto, qr?: QueryRunner): Promise<ProductResponseDto>;
    getProductById(productId: number, userId?: number, qr?: QueryRunner): Promise<ProductResponseDto>;
    updateProduct(userId: number, productId: number, dto: UpdateProductDto, qr?: QueryRunner): Promise<ProductResponseDto>;
    deleteProduct(userId: number, productId: number, qr?: QueryRunner): Promise<void>;
    getProducts(dto: GetProductsDto, userId?: number): Promise<PaginationResponseDto<ProductListItemDto>>;
    getMyProducts(userId: number, dto: GetProductsDto): Promise<PaginationResponseDto<ProductListItemDto>>;
    getMyFavoriteProducts(userId: number, dto: GetProductsDto): Promise<PaginationResponseDto<ProductListItemDto>>;
    toggleFavorite(userId: number, productId: number): Promise<{
        isFavorite: boolean;
    }>;
    isFavorite(userId: number, productId: number): Promise<boolean>;
    incrementViewCount(userId: number, productId: number): Promise<void>;
    updateProductStatus(userId: number, productId: number, dto: UpdateProductStatusDto, qr?: QueryRunner): Promise<ProductResponseDto>;
    bumpProduct(userId: number, productId: number): Promise<void>;
    getProductStats(userId: number): Promise<ProductStatsDto>;
    getProductsByUserId(targetUserId: number, dto: GetProductsDto): Promise<PaginationResponseDto<ProductListItemDto>>;
    hasReportedProduct(userId: number, productId: number): Promise<boolean>;
    createProductReport(userId: number, productId: number, dto: CreateProductReportDto): Promise<void>;
    getUserProductStats(userId: number): Promise<ProductStatsDto>;
    private toProductResponse;
    private toProductListItem;
}
