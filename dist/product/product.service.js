"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_entity_1 = require("./entity/product.entity");
const favorite_entity_1 = require("./entity/favorite.entity");
const product_view_entity_1 = require("./entity/product-view.entity");
const product_report_entity_1 = require("./entity/product-report.entity");
const dto_1 = require("../common/dto");
let ProductService = class ProductService {
    productRepository;
    favoriteRepository;
    productViewRepository;
    productReportRepository;
    constructor(productRepository, favoriteRepository, productViewRepository, productReportRepository) {
        this.productRepository = productRepository;
        this.favoriteRepository = favoriteRepository;
        this.productViewRepository = productViewRepository;
        this.productReportRepository = productReportRepository;
    }
    async createProduct(userId, dto, qr) {
        const repository = qr
            ? qr.manager.getRepository(product_entity_1.Product)
            : this.productRepository;
        const product = repository.create({
            ...dto,
            sellerId: userId,
            imageUrls: dto.imageUrls || [],
        });
        const savedProduct = await repository.save(product);
        return this.getProductById(savedProduct.id, userId, qr);
    }
    async getProductById(productId, userId, qr) {
        const repository = qr
            ? qr.manager.getRepository(product_entity_1.Product)
            : this.productRepository;
        const product = await repository.findOne({
            where: { id: productId },
            relations: ['seller'],
        });
        if (!product) {
            throw new common_1.NotFoundException('상품을 찾을 수 없습니다.');
        }
        let isFavorite = false;
        if (userId) {
            const favorite = await this.favoriteRepository.findOne({
                where: { userId, productId },
            });
            isFavorite = !!favorite;
        }
        return this.toProductResponse(product, isFavorite);
    }
    async updateProduct(userId, productId, dto, qr) {
        const repository = qr
            ? qr.manager.getRepository(product_entity_1.Product)
            : this.productRepository;
        const product = await repository.findOne({
            where: { id: productId },
        });
        if (!product) {
            throw new common_1.NotFoundException('상품을 찾을 수 없습니다.');
        }
        if (product.sellerId !== userId) {
            throw new common_1.ForbiddenException('상품을 수정할 권한이 없습니다.');
        }
        Object.assign(product, dto);
        await repository.save(product);
        return this.getProductById(productId, userId, qr);
    }
    async deleteProduct(userId, productId, qr) {
        const repository = qr
            ? qr.manager.getRepository(product_entity_1.Product)
            : this.productRepository;
        const product = await repository.findOne({
            where: { id: productId },
        });
        if (!product) {
            throw new common_1.NotFoundException('상품을 찾을 수 없습니다.');
        }
        if (product.sellerId !== userId) {
            throw new common_1.ForbiddenException('상품을 삭제할 권한이 없습니다.');
        }
        await repository.remove(product);
    }
    async getProducts(dto, userId) {
        const { sortBy, category, status, search } = dto;
        const page = dto.page || 1;
        const limit = dto.limit || 20;
        const offset = (page - 1) * limit;
        const queryBuilder = this.productRepository
            .createQueryBuilder('product')
            .leftJoinAndSelect('product.seller', 'seller');
        if (category) {
            queryBuilder.andWhere('product.category = :category', { category });
        }
        if (status) {
            queryBuilder.andWhere('product.status = :status', { status });
        }
        if (search) {
            queryBuilder.andWhere('(product.title LIKE :search OR product.description LIKE :search)', { search: `%${search}%` });
        }
        switch (sortBy) {
            case dto_1.SortBy.oldest:
                queryBuilder.orderBy('product.createdAt', 'ASC');
                break;
            case dto_1.SortBy.priceAsc:
                queryBuilder.orderBy('product.price', 'ASC');
                break;
            case dto_1.SortBy.priceDesc:
                queryBuilder.orderBy('product.price', 'DESC');
                break;
            case dto_1.SortBy.popular:
                queryBuilder.orderBy('product.favoriteCount', 'DESC');
                break;
            case dto_1.SortBy.latest:
            default:
                queryBuilder.orderBy('product.createdAt', 'DESC');
                break;
        }
        queryBuilder.skip(offset).take(limit);
        const [products, total] = await queryBuilder.getManyAndCount();
        let userFavorites = new Set();
        if (userId && products.length > 0) {
            const productIds = products.map((p) => p.id);
            const favorites = await this.favoriteRepository.find({
                where: {
                    userId,
                    productId: (0, typeorm_2.In)(productIds),
                },
            });
            userFavorites = new Set(favorites.map((f) => f.productId));
        }
        const items = products.map((product) => this.toProductListItem(product, userFavorites.has(product.id)));
        return new dto_1.PaginationResponseDto(items, total, page, limit);
    }
    async getMyProducts(userId, dto) {
        const { status } = dto;
        const page = dto.page || 1;
        const limit = dto.limit || 20;
        const offset = (page - 1) * limit;
        const queryBuilder = this.productRepository
            .createQueryBuilder('product')
            .where('product.sellerId = :userId', { userId })
            .orderBy('product.createdAt', 'DESC')
            .skip(offset)
            .take(limit);
        if (status) {
            queryBuilder.andWhere('product.status = :status', { status });
        }
        const [products, total] = await queryBuilder.getManyAndCount();
        const items = products.map((product) => this.toProductListItem(product));
        return new dto_1.PaginationResponseDto(items, total, page, limit);
    }
    async getMyFavoriteProducts(userId, dto) {
        const page = dto.page || 1;
        const limit = dto.limit || 20;
        const offset = (page - 1) * limit;
        const queryBuilder = this.favoriteRepository
            .createQueryBuilder('favorite')
            .leftJoinAndSelect('favorite.product', 'product')
            .where('favorite.userId = :userId', { userId })
            .orderBy('favorite.createdAt', 'DESC')
            .skip(offset)
            .take(limit);
        const [favorites, total] = await queryBuilder.getManyAndCount();
        const items = favorites.map((favorite) => this.toProductListItem(favorite.product, true));
        return new dto_1.PaginationResponseDto(items, total, page, limit);
    }
    async toggleFavorite(userId, productId) {
        const product = await this.productRepository.findOne({
            where: { id: productId },
        });
        if (!product) {
            throw new common_1.NotFoundException('상품을 찾을 수 없습니다.');
        }
        const existingFavorite = await this.favoriteRepository.findOne({
            where: { userId, productId },
        });
        if (existingFavorite) {
            await this.favoriteRepository.remove(existingFavorite);
            await this.productRepository.decrement({ id: productId }, 'favoriteCount', 1);
            return { isFavorite: false };
        }
        else {
            const favorite = this.favoriteRepository.create({ userId, productId });
            await this.favoriteRepository.save(favorite);
            await this.productRepository.increment({ id: productId }, 'favoriteCount', 1);
            return { isFavorite: true };
        }
    }
    async isFavorite(userId, productId) {
        const favorite = await this.favoriteRepository.findOne({
            where: { userId, productId },
        });
        return !!favorite;
    }
    async incrementViewCount(userId, productId) {
        const product = await this.productRepository.findOne({
            where: { id: productId },
        });
        if (!product) {
            throw new common_1.NotFoundException('상품을 찾을 수 없습니다.');
        }
        const existingView = await this.productViewRepository.findOne({
            where: { userId, productId },
        });
        if (!existingView) {
            const view = this.productViewRepository.create({ userId, productId });
            await this.productViewRepository.save(view);
            await this.productRepository.increment({ id: productId }, 'viewCount', 1);
        }
    }
    async updateProductStatus(userId, productId, dto, qr) {
        const repository = qr
            ? qr.manager.getRepository(product_entity_1.Product)
            : this.productRepository;
        const product = await repository.findOne({
            where: { id: productId },
        });
        if (!product) {
            throw new common_1.NotFoundException('상품을 찾을 수 없습니다.');
        }
        if (product.sellerId !== userId) {
            throw new common_1.ForbiddenException('상품 상태를 변경할 권한이 없습니다.');
        }
        product.status = dto.status;
        await repository.save(product);
        return this.getProductById(productId, userId, qr);
    }
    async bumpProduct(userId, productId) {
        const product = await this.productRepository.findOne({
            where: { id: productId },
        });
        if (!product) {
            throw new common_1.NotFoundException('상품을 찾을 수 없습니다.');
        }
        if (product.sellerId !== userId) {
            throw new common_1.ForbiddenException('상품을 끌어올릴 권한이 없습니다.');
        }
        await this.productRepository.save(product);
    }
    async getProductStats(userId) {
        const sellingCount = await this.productRepository.count({
            where: { sellerId: userId, status: product_entity_1.ProductStatus.selling },
        });
        const soldCount = await this.productRepository.count({
            where: { sellerId: userId, status: product_entity_1.ProductStatus.sold },
        });
        return {
            sellingCount,
            soldCount,
            reviewCount: 0,
            averageRating: 0,
        };
    }
    async getProductsByUserId(targetUserId, dto) {
        const { status } = dto;
        const page = dto.page || 1;
        const limit = dto.limit || 20;
        const offset = (page - 1) * limit;
        const queryBuilder = this.productRepository
            .createQueryBuilder('product')
            .where('product.sellerId = :targetUserId', { targetUserId })
            .orderBy('product.createdAt', 'DESC')
            .skip(offset)
            .take(limit);
        if (status) {
            queryBuilder.andWhere('product.status = :status', { status });
        }
        const [products, total] = await queryBuilder.getManyAndCount();
        const items = products.map((product) => this.toProductListItem(product));
        return new dto_1.PaginationResponseDto(items, total, page, limit);
    }
    async hasReportedProduct(userId, productId) {
        const report = await this.productReportRepository.findOne({
            where: { reporterId: userId, productId },
        });
        return !!report;
    }
    async createProductReport(userId, productId, dto) {
        const product = await this.productRepository.findOne({
            where: { id: productId },
        });
        if (!product) {
            throw new common_1.NotFoundException('상품을 찾을 수 없습니다.');
        }
        if (product.sellerId === userId) {
            throw new common_1.BadRequestException('자신의 상품은 신고할 수 없습니다.');
        }
        const existingReport = await this.productReportRepository.findOne({
            where: { reporterId: userId, productId },
        });
        if (existingReport) {
            throw new common_1.BadRequestException('이미 신고한 상품입니다.');
        }
        const report = this.productReportRepository.create({
            productId,
            reporterId: userId,
            reason: dto.reason,
            description: dto.description,
        });
        await this.productReportRepository.save(report);
    }
    async getUserProductStats(userId) {
        const [sellingCount, soldCount] = await Promise.all([
            this.productRepository.count({
                where: { sellerId: userId, status: product_entity_1.ProductStatus.selling },
            }),
            this.productRepository.count({
                where: { sellerId: userId, status: product_entity_1.ProductStatus.sold },
            }),
        ]);
        return {
            sellingCount,
            soldCount,
            reviewCount: 0,
            averageRating: 0,
        };
    }
    toProductResponse(product, isFavorite = false) {
        return {
            id: product.id,
            title: product.title,
            category: product.category,
            price: product.price,
            condition: product.condition,
            description: product.description,
            tradeMethod: product.tradeMethod,
            baseAddress: product.baseAddress,
            detailAddress: product.detailAddress,
            imageUrls: product.imageUrls || [],
            viewCount: product.viewCount,
            favoriteCount: product.favoriteCount,
            chatCount: product.chatCount,
            status: product.status,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
            seller: {
                id: product.seller?.id,
                nickname: product.seller?.nickname,
                profileImageUrl: product.seller?.profileImageUrl,
            },
            isFavorite,
        };
    }
    toProductListItem(product, isFavorite = false) {
        return {
            id: product.id,
            title: product.title,
            category: product.category,
            price: product.price,
            status: product.status,
            thumbnailUrl: product.imageUrls?.[0],
            favoriteCount: product.favoriteCount,
            chatCount: product.chatCount,
            createdAt: product.createdAt,
            isFavorite,
        };
    }
};
exports.ProductService = ProductService;
exports.ProductService = ProductService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(1, (0, typeorm_1.InjectRepository)(favorite_entity_1.Favorite)),
    __param(2, (0, typeorm_1.InjectRepository)(product_view_entity_1.ProductView)),
    __param(3, (0, typeorm_1.InjectRepository)(product_report_entity_1.ProductReport)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ProductService);
//# sourceMappingURL=product.service.js.map