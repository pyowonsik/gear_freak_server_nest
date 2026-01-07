import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { QueryRunner as QR } from 'typeorm';

import { ProductService } from './product.service';
import { UserId, QueryRunner } from '../common/decorator';
import { TransactionInterceptor } from '../common/interceptor';
import { PaginationResponseDto } from '../common/dto';
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

@Controller('product')
@ApiTags('product')
@ApiBearerAuth()
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseInterceptors(TransactionInterceptor)
  @ApiOperation({
    summary: '상품 등록',
    description: '새로운 상품을 등록합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '상품 등록 성공',
    type: ProductResponseDto,
  })
  async createProduct(
    @UserId() userId: number,
    @Body() dto: CreateProductDto,
    @QueryRunner() qr: QR,
  ): Promise<ProductResponseDto> {
    return this.productService.createProduct(userId, dto, qr);
  }

  @Get()
  @ApiOperation({
    summary: '상품 목록 조회',
    description: '상품 목록을 페이지네이션, 필터링, 정렬하여 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '상품 목록',
  })
  async getProducts(
    @Query() dto: GetProductsDto,
    @UserId() userId: number,
  ): Promise<PaginationResponseDto<ProductListItemDto>> {
    return this.productService.getProducts(dto, userId);
  }

  @Get('my')
  @ApiOperation({
    summary: '내 상품 목록 조회',
    description: '내가 등록한 상품 목록을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '내 상품 목록',
  })
  async getMyProducts(
    @UserId() userId: number,
    @Query() dto: GetProductsDto,
  ): Promise<PaginationResponseDto<ProductListItemDto>> {
    return this.productService.getMyProducts(userId, dto);
  }

  @Get('favorites')
  @ApiOperation({
    summary: '찜한 상품 목록 조회',
    description: '내가 찜한 상품 목록을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '찜한 상품 목록',
  })
  async getMyFavoriteProducts(
    @UserId() userId: number,
    @Query() dto: GetProductsDto,
  ): Promise<PaginationResponseDto<ProductListItemDto>> {
    return this.productService.getMyFavoriteProducts(userId, dto);
  }

  @Get('stats')
  @ApiOperation({
    summary: '내 상품 통계 조회',
    description: '내 상품 판매 통계를 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '상품 통계',
    type: ProductStatsDto,
  })
  async getProductStats(@UserId() userId: number): Promise<ProductStatsDto> {
    return this.productService.getProductStats(userId);
  }

  @Get('user/:userId')
  @ApiOperation({
    summary: '특정 사용자의 상품 목록 조회',
    description: '특정 사용자가 등록한 상품 목록을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '사용자의 상품 목록',
  })
  async getProductsByUserId(
    @Param('userId', ParseIntPipe) targetUserId: number,
    @Query() dto: GetProductsDto,
  ): Promise<PaginationResponseDto<ProductListItemDto>> {
    return this.productService.getProductsByUserId(targetUserId, dto);
  }

  @Get(':id')
  @ApiOperation({
    summary: '상품 상세 조회',
    description: '상품 상세 정보를 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '상품 상세 정보',
    type: ProductResponseDto,
  })
  @ApiResponse({ status: 404, description: '상품을 찾을 수 없음' })
  async getProductById(
    @Param('id', ParseIntPipe) productId: number,
    @UserId() userId: number,
  ): Promise<ProductResponseDto> {
    return this.productService.getProductById(productId, userId);
  }

  @Patch(':id')
  @UseInterceptors(TransactionInterceptor)
  @ApiOperation({
    summary: '상품 수정',
    description: '상품 정보를 수정합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '수정된 상품 정보',
    type: ProductResponseDto,
  })
  @ApiResponse({ status: 403, description: '권한 없음' })
  @ApiResponse({ status: 404, description: '상품을 찾을 수 없음' })
  async updateProduct(
    @UserId() userId: number,
    @Param('id', ParseIntPipe) productId: number,
    @Body() dto: UpdateProductDto,
    @QueryRunner() qr: QR,
  ): Promise<ProductResponseDto> {
    return this.productService.updateProduct(userId, productId, dto, qr);
  }

  @Delete(':id')
  @UseInterceptors(TransactionInterceptor)
  @ApiOperation({
    summary: '상품 삭제',
    description: '상품을 삭제합니다.',
  })
  @ApiResponse({ status: 200, description: '삭제 완료' })
  @ApiResponse({ status: 403, description: '권한 없음' })
  @ApiResponse({ status: 404, description: '상품을 찾을 수 없음' })
  async deleteProduct(
    @UserId() userId: number,
    @Param('id', ParseIntPipe) productId: number,
    @QueryRunner() qr: QR,
  ): Promise<{ message: string }> {
    await this.productService.deleteProduct(userId, productId, qr);
    return { message: '상품이 삭제되었습니다.' };
  }

  @Post(':id/favorite')
  @ApiOperation({
    summary: '찜하기 토글',
    description: '상품 찜하기를 토글합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '찜하기 토글 결과',
  })
  async toggleFavorite(
    @UserId() userId: number,
    @Param('id', ParseIntPipe) productId: number,
  ): Promise<{ isFavorite: boolean }> {
    return this.productService.toggleFavorite(userId, productId);
  }

  @Get(':id/favorite')
  @ApiOperation({
    summary: '찜 여부 확인',
    description: '상품 찜 여부를 확인합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '찜 여부',
  })
  async isFavorite(
    @UserId() userId: number,
    @Param('id', ParseIntPipe) productId: number,
  ): Promise<{ isFavorite: boolean }> {
    const isFavorite = await this.productService.isFavorite(userId, productId);
    return { isFavorite };
  }

  @Post(':id/view')
  @ApiOperation({
    summary: '조회수 증가',
    description: '상품 조회수를 증가시킵니다 (사용자당 1회).',
  })
  @ApiResponse({ status: 201, description: '조회수 증가 성공' })
  async incrementViewCount(
    @UserId() userId: number,
    @Param('id', ParseIntPipe) productId: number,
  ): Promise<{ message: string }> {
    await this.productService.incrementViewCount(userId, productId);
    return { message: '조회수가 증가되었습니다.' };
  }

  @Patch(':id/status')
  @UseInterceptors(TransactionInterceptor)
  @ApiOperation({
    summary: '상품 상태 변경',
    description: '상품 판매 상태를 변경합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '변경된 상품 정보',
    type: ProductResponseDto,
  })
  async updateProductStatus(
    @UserId() userId: number,
    @Param('id', ParseIntPipe) productId: number,
    @Body() dto: UpdateProductStatusDto,
    @QueryRunner() qr: QR,
  ): Promise<ProductResponseDto> {
    return this.productService.updateProductStatus(userId, productId, dto, qr);
  }

  @Patch(':id/bump')
  @ApiOperation({
    summary: '상품 끌어올리기',
    description: '상품을 목록 상단으로 끌어올립니다.',
  })
  @ApiResponse({ status: 200, description: '끌어올리기 성공' })
  async bumpProduct(
    @UserId() userId: number,
    @Param('id', ParseIntPipe) productId: number,
  ): Promise<{ message: string }> {
    await this.productService.bumpProduct(userId, productId);
    return { message: '상품이 끌어올려졌습니다.' };
  }

  @Get(':id/report')
  @ApiOperation({
    summary: '신고 여부 확인',
    description: '상품 신고 여부를 확인합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '신고 여부',
  })
  async hasReportedProduct(
    @UserId() userId: number,
    @Param('id', ParseIntPipe) productId: number,
  ): Promise<{ hasReported: boolean }> {
    const hasReported = await this.productService.hasReportedProduct(
      userId,
      productId,
    );
    return { hasReported };
  }

  @Post(':id/report')
  @ApiOperation({
    summary: '상품 신고',
    description: '상품을 신고합니다.',
  })
  @ApiResponse({ status: 201, description: '신고 성공' })
  @ApiResponse({ status: 400, description: '이미 신고한 상품' })
  async createProductReport(
    @UserId() userId: number,
    @Param('id', ParseIntPipe) productId: number,
    @Body() dto: CreateProductReportDto,
  ): Promise<{ message: string }> {
    await this.productService.createProductReport(userId, productId, dto);
    return { message: '상품이 신고되었습니다.' };
  }

  @Get('stats/:userId')
  @ApiOperation({
    summary: '사용자 상품 통계 조회',
    description: '특정 사용자의 상품 통계를 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '상품 통계',
  })
  async getUserProductStats(
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.productService.getUserProductStats(userId);
  }
}
