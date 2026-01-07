import { FcmService } from './fcm.service';
import { RegisterFcmTokenDto, DeleteFcmTokenDto } from './dto';
export declare class FcmController {
    private readonly fcmService;
    constructor(fcmService: FcmService);
    registerToken(userId: number, dto: RegisterFcmTokenDto): Promise<{
        message: string;
    }>;
    deleteToken(userId: number, dto: DeleteFcmTokenDto): Promise<{
        message: string;
    }>;
}
