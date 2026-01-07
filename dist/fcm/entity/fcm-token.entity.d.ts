import { BaseTable } from '../../common/entity/base-table.entity';
import { User } from '../../user/entity/user.entity';
export declare enum DeviceType {
    ios = "ios",
    android = "android",
    web = "web"
}
export declare class FcmToken extends BaseTable {
    id: number;
    userId: number;
    user: User;
    token: string;
    deviceType: DeviceType;
    lastUsedAt: Date;
}
