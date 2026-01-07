import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryRunner, Like, In } from 'typeorm';

import { Product, ProductStatus } from './entity/product.entity';
import { Favorite } from './entity/favorite.entity';
import { ProductView } from './entity/product-view.entity';
import { ProductReport } from './entity/product-report.entity';
import { User } from '../user/entity/user.entity';
import {
  CreateProductDto,
  UpdateProductDto,
  UpdateProductStatusDto,
  GetProductsDto,
  ProductResponseDto,
  ProductListItemDto,
  ProductStatsDto,
  CreateProductReportDto,
} from './dto';
import { PaginationResponseDto, SortBy } from '../common/dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Favorite)
    private readonly favoriteRepository: Repository<Favorite>,
    @InjectRepository(ProductView)
    private readonly productViewRepository: Repository<ProductView>,
    @InjectRepository(ProductReport)
    private readonly productReportRepository: Repository<ProductReport>,
  ) {}

  /**
   * Create product
   */
  async createProduct(
    userId: number,
    dto: CreateProductDto,
    qr?: QueryRunner,
  ): Promise<ProductResponseDto> {
    const repository = qr
      ? qr.manager.getRepository(Product)
      : this.productRepository;

    const product = repository.create({
      ...dto,
      sellerId: userId,
      imageUrls: dto.imageUrls || [],
    });

    const savedProduct = await repository.save(product);

    return this.getProductById(savedProduct.id, userId, qr);
  }

  /**
   * Get product by ID
   */
  async getProductById(
    productId: number,
    userId?: number,
    qr?: QueryRunner,
  ): Promise<ProductResponseDto> {
    const repository = qr
      ? qr.manager.getRepository(Product)
      : this.productRepository;

    const product = await repository.findOne({
      where: { id: productId },
      relations: ['seller'],
    });

    if (!product) {
      throw new NotFoundException('상품을 찾을 수 없습니다.');
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

  /**
   * Update product
   */
  async updateProduct(
    userId: number,
    productId: number,
    dto: UpdateProductDto,
    qr?: QueryRunner,
  ): Promise<ProductResponseDto> {
    const repository = qr
      ? qr.manager.getRepository(Product)
      : this.productRepository;

    const product = await repository.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('상품을 찾을 수 없습니다.');
    }

    if (product.sellerId !== userId) {
      throw new ForbiddenException('상품을 수정할 권한이 없습니다.');
    }

    // Update fields
    Object.assign(product, dto);

    await repository.save(product);

    return this.getProductById(productId, userId, qr);
  }

  /**
   * Delete product
   */
  async deleteProduct(
    userId: number,
    productId: number,
    qr?: QueryRunner,
  ): Promise<void> {
    const repository = qr
      ? qr.manager.getRepository(Product)
      : this.productRepository;

    const product = await repository.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('상품을 찾을 수 없습니다.');
    }

    if (product.sellerId !== userId) {
      throw new ForbiddenException('상품을 삭제할 권한이 없습니다.');
    }

    await repository.remove(product);
  }

  /**
   * Get products with pagination
   */
  async getProducts(
    dto: GetProductsDto,
    userId?: number,
  ): Promise<PaginationResponseDto<ProductListItemDto>> {
    const { sortBy, category, status, search } = dto;
    const page = dto.page || 1;
    const limit = dto.limit || 20;
    const offset = (page - 1) * limit;

    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.seller', 'seller');

    // Filters
    if (category) {
      queryBuilder.andWhere('product.category = :category', { category });
    }

    if (status) {
      queryBuilder.andWhere('product.status = :status', { status });
    }

    if (search) {
      queryBuilder.andWhere(
        '(product.title LIKE :search OR product.description LIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Sorting
    switch (sortBy) {
      case SortBy.oldest:
        queryBuilder.orderBy('product.createdAt', 'ASC');
        break;
      case SortBy.priceAsc:
        queryBuilder.orderBy('product.price', 'ASC');
        break;
      case SortBy.priceDesc:
        queryBuilder.orderBy('product.price', 'DESC');
        break;
      case SortBy.popular:
        queryBuilder.orderBy('product.favoriteCount', 'DESC');
        break;
      case SortBy.latest:
      default:
        queryBuilder.orderBy('product.createdAt', 'DESC');
        break;
    }

    // Pagination
    queryBuilder.skip(offset).take(limit);

    const [products, total] = await queryBuilder.getManyAndCount();

    // Get favorites for current user
    let userFavorites: Set<number> = new Set();
    if (userId && products.length > 0) {
      const productIds = products.map((p) => p.id);
      const favorites = await this.favoriteRepository.find({
        where: {
          userId,
          productId: In(productIds),
        },
      });
      userFavorites = new Set(favorites.map((f) => f.productId));
    }

    const items = products.map((product) =>
      this.toProductListItem(product, userFavorites.has(product.id)),
    );

    return new PaginationResponseDto(items, total, page, limit);
  }

  /**
   * Get my products
   */
  async getMyProducts(
    userId: number,
    dto: GetProductsDto,
  ): Promise<PaginationResponseDto<ProductListItemDto>> {
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

    return new PaginationResponseDto(items, total, page, limit);
  }

  /**
   * Get my favorite products
   */
  async getMyFavoriteProducts(
    userId: number,
    dto: GetProductsDto,
  ): Promise<PaginationResponseDto<ProductListItemDto>> {
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

    const items = favorites.map((favorite) =>
      this.toProductListItem(favorite.product, true),
    );

    return new PaginationResponseDto(items, total, page, limit);
  }

  /**
   * Toggle favorite
   */
  async toggleFavorite(
    userId: number,
    productId: number,
  ): Promise<{ isFavorite: boolean }> {
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('상품을 찾을 수 없습니다.');
    }

    const existingFavorite = await this.favoriteRepository.findOne({
      where: { userId, productId },
    });

    if (existingFavorite) {
      // Remove favorite
      await this.favoriteRepository.remove(existingFavorite);
      await this.productRepository.decrement({ id: productId }, 'favoriteCount', 1);
      return { isFavorite: false };
    } else {
      // Add favorite
      const favorite = this.favoriteRepository.create({ userId, productId });
      await this.favoriteRepository.save(favorite);
      await this.productRepository.increment({ id: productId }, 'favoriteCount', 1);
      return { isFavorite: true };
    }
  }

  /**
   * Check if favorite
   */
  async isFavorite(userId: number, productId: number): Promise<boolean> {
    const favorite = await this.favoriteRepository.findOne({
      where: { userId, productId },
    });
    return !!favorite;
  }

  /**
   * Increment view count
   */
  async incrementViewCount(userId: number, productId: number): Promise<void> {
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('상품을 찾을 수 없습니다.');
    }

    // Check if already viewed
    const existingView = await this.productViewRepository.findOne({
      where: { userId, productId },
    });

    if (!existingView) {
      const view = this.productViewRepository.create({ userId, productId });
      await this.productViewRepository.save(view);
      await this.productRepository.increment({ id: productId }, 'viewCount', 1);
    }
  }

  /**
   * Update product status
   */
  async updateProductStatus(
    userId: number,
    productId: number,
    dto: UpdateProductStatusDto,
    qr?: QueryRunner,
  ): Promise<ProductResponseDto> {
    const repository = qr
      ? qr.manager.getRepository(Product)
      : this.productRepository;

    const product = await repository.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('상품을 찾을 수 없습니다.');
    }

    if (product.sellerId !== userId) {
      throw new ForbiddenException('상품 상태를 변경할 권한이 없습니다.');
    }

    product.status = dto.status;
    await repository.save(product);

    return this.getProductById(productId, userId, qr);
  }

  /**
   * Bump product (refresh updatedAt)
   */
  async bumpProduct(userId: number, productId: number): Promise<void> {
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('상품을 찾을 수 없습니다.');
    }

    if (product.sellerId !== userId) {
      throw new ForbiddenException('상품을 끌어올릴 권한이 없습니다.');
    }

    // Touch updatedAt to bump to top
    await this.productRepository.save(product);
  }

  /**
   * Get product stats
   */
  async getProductStats(userId: number): Promise<ProductStatsDto> {
    const sellingCount = await this.productRepository.count({
      where: { sellerId: userId, status: ProductStatus.selling },
    });

    const soldCount = await this.productRepository.count({
      where: { sellerId: userId, status: ProductStatus.sold },
    });

    // TODO: Integrate with Review module
    return {
      sellingCount,
      soldCount,
      reviewCount: 0,
      averageRating: 0,
    };
  }

  /**
   * Get products by user ID
   */
  async getProductsByUserId(
    targetUserId: number,
    dto: GetProductsDto,
  ): Promise<PaginationResponseDto<ProductListItemDto>> {
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

    return new PaginationResponseDto(items, total, page, limit);
  }

  /**
   * Check if product is reported by user
   */
  async hasReportedProduct(userId: number, productId: number): Promise<boolean> {
    const report = await this.productReportRepository.findOne({
      where: { reporterId: userId, productId },
    });
    return !!report;
  }

  /**
   * Create product report
   */
  async createProductReport(
    userId: number,
    productId: number,
    dto: CreateProductReportDto,
  ): Promise<void> {
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('상품을 찾을 수 없습니다.');
    }

    if (product.sellerId === userId) {
      throw new BadRequestException('자신의 상품은 신고할 수 없습니다.');
    }

    const existingReport = await this.productReportRepository.findOne({
      where: { reporterId: userId, productId },
    });

    if (existingReport) {
      throw new BadRequestException('이미 신고한 상품입니다.');
    }

    const report = this.productReportRepository.create({
      productId,
      reporterId: userId,
      reason: dto.reason,
      description: dto.description,
    });

    await this.productReportRepository.save(report);
  }

  /**
   * Get user product statistics
   */
  async getUserProductStats(userId: number): Promise<ProductStatsDto> {
    const [sellingCount, soldCount] = await Promise.all([
      this.productRepository.count({
        where: { sellerId: userId, status: ProductStatus.selling },
      }),
      this.productRepository.count({
        where: { sellerId: userId, status: ProductStatus.sold },
      }),
    ]);

    // TODO: Get review stats from review repository
    return {
      sellingCount,
      soldCount,
      reviewCount: 0,
      averageRating: 0,
    };
  }

  // ==================== Private Methods ====================

  private toProductResponse(
    product: Product,
    isFavorite: boolean = false,
  ): ProductResponseDto {
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

  private toProductListItem(
    product: Product,
    isFavorite: boolean = false,
  ): ProductListItemDto {
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
}
