import { DeviceType } from '../entity/fcm-token.entity';
export declare class RegisterFcmTokenDto {
    token: string;
    deviceType: DeviceType;
}
export declare class DeleteFcmTokenDto {
    token: string;
}
