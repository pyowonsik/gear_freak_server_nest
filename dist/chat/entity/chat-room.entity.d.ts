import { BaseTable } from '../../common/entity/base-table.entity';
import { Product } from '../../product/entity/product.entity';
export declare enum ChatRoomType {
    direct = "direct",
    group = "group"
}
export declare class ChatRoom extends BaseTable {
    id: number;
    productId: number;
    product: Product;
    title: string;
    chatRoomType: ChatRoomType;
    participantCount: number;
    lastActivityAt: Date;
}
