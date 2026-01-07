import type { QueryRunner as QR } from 'typeorm';
import { ProductService } from './product.service';
import { PaginationResponseDto } from '../common/dto';
import { CreateProductDto, UpdateProductDto, UpdateProductStatusDto, GetProductsDto, ProductResponseDto, ProductListItemDto, ProductStatsDto, CreateProductReportDto } from './dto';
export declare class ProductController {
    private readonly productService;
    constructor(productService: ProductService);
    createProduct(userId: number, dto: CreateProductDto, qr: QR): Promise<ProductResponseDto>;
    getProducts(dto: GetProductsDto, userId: number): Promise<PaginationResponseDto<ProductListItemDto>>;
    getMyProducts(userId: number, dto: GetProductsDto): Promise<PaginationResponseDto<ProductListItemDto>>;
    getMyFavoriteProducts(userId: number, dto: GetProductsDto): Promise<PaginationResponseDto<ProductListItemDto>>;
    getProductStats(userId: number): Promise<ProductStatsDto>;
    getProductsByUserId(targetUserId: number, dto: GetProductsDto): Promise<PaginationResponseDto<ProductListItemDto>>;
    getProductById(productId: number, userId: number): Promise<ProductResponseDto>;
    updateProduct(userId: number, productId: number, dto: UpdateProductDto, qr: QR): Promise<ProductResponseDto>;
    deleteProduct(userId: number, productId: number, qr: QR): Promise<{
        message: string;
    }>;
    toggleFavorite(userId: number, productId: number): Promise<{
        isFavorite: boolean;
    }>;
    isFavorite(userId: number, productId: number): Promise<{
        isFavorite: boolean;
    }>;
    incrementViewCount(userId: number, productId: number): Promise<{
        message: string;
    }>;
    updateProductStatus(userId: number, productId: number, dto: UpdateProductStatusDto, qr: QR): Promise<ProductResponseDto>;
    bumpProduct(userId: number, productId: number): Promise<{
        message: string;
    }>;
    hasReportedProduct(userId: number, productId: number): Promise<{
        hasReported: boolean;
    }>;
    createProductReport(userId: number, productId: number, dto: CreateProductReportDto): Promise<{
        message: string;
    }>;
    getUserProductStats(userId: number): Promise<ProductStatsDto>;
}
