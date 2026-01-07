import { BaseTable } from '../../common/entity/base-table.entity';
import { User } from '../../user/entity/user.entity';
import { Product } from './product.entity';
export declare enum ReportReason {
    spam = "spam",
    inappropriate = "inappropriate",
    fake = "fake",
    prohibited = "prohibited",
    duplicate = "duplicate",
    other = "other"
}
export declare enum ReportStatus {
    pending = "pending",
    processing = "processing",
    resolved = "resolved",
    rejected = "rejected"
}
export declare class ProductReport extends BaseTable {
    id: number;
    productId: number;
    product: Product;
    reporterId: number;
    reporter: User;
    reason: ReportReason;
    description: string;
    status: ReportStatus;
    processedById: number;
    processedBy: User;
    processedAt: Date;
    processNote: string;
}
