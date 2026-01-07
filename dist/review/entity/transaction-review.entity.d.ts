import { BaseTable } from '../../common/entity/base-table.entity';
import { User } from '../../user/entity/user.entity';
import { Product } from '../../product/entity/product.entity';
import { ChatRoom } from '../../chat/entity/chat-room.entity';
export declare enum ReviewType {
    buyer_to_seller = "buyer_to_seller",
    seller_to_buyer = "seller_to_buyer"
}
export declare class TransactionReview extends BaseTable {
    id: number;
    productId: number;
    product: Product;
    chatRoomId: number;
    chatRoom: ChatRoom;
    reviewerId: number;
    reviewer: User;
    revieweeId: number;
    reviewee: User;
    reviewType: ReviewType;
    rating: number;
    content: string;
}
