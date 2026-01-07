import { ConfigService } from '@nestjs/config';
import { BucketType, GeneratePresignedUrlDto, PresignedUrlResponseDto } from './dto';
export declare class S3Service {
    private readonly configService;
    private s3Client;
    private publicBucket;
    private privateBucket;
    private region;
    constructor(configService: ConfigService);
    generatePresignedUploadUrl(userId: number, dto: GeneratePresignedUrlDto): Promise<PresignedUrlResponseDto>;
    deleteFile(bucketType: BucketType, fileKey: string): Promise<void>;
    moveFile(bucketType: BucketType, sourceKey: string, destKey: string): Promise<string>;
    deleteFiles(bucketType: BucketType, fileKeys: string[]): Promise<void>;
    extractFileKeyFromUrl(url: string): string | null;
    private getBucket;
    private generateFileKey;
    private getFileUrl;
}
