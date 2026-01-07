import { S3Service } from './s3.service';
import { GeneratePresignedUrlDto, PresignedUrlResponseDto, DeleteFileDto } from './dto';
export declare class S3Controller {
    private readonly s3Service;
    constructor(s3Service: S3Service);
    generatePresignedUrl(userId: number, dto: GeneratePresignedUrlDto): Promise<PresignedUrlResponseDto>;
    deleteFile(dto: DeleteFileDto): Promise<{
        message: string;
    }>;
}
