import { BaseTable } from '../../common/entity/base-table.entity';
import { User } from '../../user/entity/user.entity';
import { Product } from './product.entity';
export declare class ProductView extends BaseTable {
    id: number;
    userId: number;
    user: User;
    productId: number;
    product: Product;
}
