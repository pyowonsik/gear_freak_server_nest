import { PagePaginationDto } from '../../common/dto';
import { ProductCategory, ProductStatus } from '../entity/product.entity';
export declare class GetProductsDto extends PagePaginationDto {
    category?: ProductCategory;
    status?: ProductStatus;
    search?: string;
}
