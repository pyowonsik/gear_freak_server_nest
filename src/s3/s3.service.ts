import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  CopyObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

import { envVariableKeys } from '../common/const/env.const';
import {
  BucketType,
  FileCategory,
  GeneratePresignedUrlDto,
  PresignedUrlResponseDto,
} from './dto';

@Injectable()
export class S3Service {
  private s3Client: S3Client;
  private publicBucket: string;
  private privateBucket: string;
  private region: string;

  constructor(private readonly configService: ConfigService) {
    this.region = configService.get<string>(envVariableKeys.awsRegion) || 'ap-northeast-2';
    this.publicBucket = configService.get<string>(envVariableKeys.s3PublicBucket) || '';
    this.privateBucket = configService.get<string>(envVariableKeys.s3PrivateBucket) || '';

    this.s3Client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: configService.get<string>(envVariableKeys.awsAccessKeyId) || '',
        secretAccessKey: configService.get<string>(
          envVariableKeys.awsSecretAccessKey,
        ) || '',
      },
    });
  }

  /**
   * Generate presigned URL for file upload
   */
  async generatePresignedUploadUrl(
    userId: number,
    dto: GeneratePresignedUrlDto,
  ): Promise<PresignedUrlResponseDto> {
    const { bucketType, fileCategory, fileName, contentType, productId, chatRoomId } = dto;

    const bucket = this.getBucket(bucketType);
    const fileKey = this.generateFileKey(
      fileCategory,
      userId,
      fileName,
      productId,
      chatRoomId,
    );

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: fileKey,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(this.s3Client, command, {
      expiresIn: 3600, // 1 hour
    });

    const fileUrl = this.getFileUrl(bucket, fileKey);

    return {
      uploadUrl,
      fileUrl,
      fileKey,
    };
  }

  /**
   * Delete file from S3
   */
  async deleteFile(bucketType: BucketType, fileKey: string): Promise<void> {
    const bucket = this.getBucket(bucketType);

    const command = new DeleteObjectCommand({
      Bucket: bucket,
      Key: fileKey,
    });

    await this.s3Client.send(command);
  }

  /**
   * Move file from temp to permanent location
   */
  async moveFile(
    bucketType: BucketType,
    sourceKey: string,
    destKey: string,
  ): Promise<string> {
    const bucket = this.getBucket(bucketType);

    // Copy to destination
    const copyCommand = new CopyObjectCommand({
      Bucket: bucket,
      CopySource: `${bucket}/${sourceKey}`,
      Key: destKey,
    });

    await this.s3Client.send(copyCommand);

    // Delete source
    const deleteCommand = new DeleteObjectCommand({
      Bucket: bucket,
      Key: sourceKey,
    });

    await this.s3Client.send(deleteCommand);

    return this.getFileUrl(bucket, destKey);
  }

  /**
   * Delete multiple files
   */
  async deleteFiles(
    bucketType: BucketType,
    fileKeys: string[],
  ): Promise<void> {
    await Promise.all(
      fileKeys.map((fileKey) => this.deleteFile(bucketType, fileKey)),
    );
  }

  /**
   * Extract file key from URL
   */
  extractFileKeyFromUrl(url: string): string | null {
    try {
      const urlObj = new URL(url);
      // Remove leading slash
      return urlObj.pathname.slice(1);
    } catch {
      return null;
    }
  }

  // ==================== Private Methods ====================

  private getBucket(bucketType: BucketType): string {
    return bucketType === BucketType.public
      ? this.publicBucket
      : this.privateBucket;
  }

  private generateFileKey(
    category: FileCategory,
    userId: number,
    fileName: string,
    productId?: number,
    chatRoomId?: number,
  ): string {
    const uuid = uuidv4();
    const extension = fileName.split('.').pop() || '';
    const uniqueFileName = `${uuid}.${extension}`;

    switch (category) {
      case FileCategory.product:
        if (productId) {
          return `product/${productId}/${uniqueFileName}`;
        }
        // Temp location before product is created
        return `temp/product/${userId}/${uniqueFileName}`;

      case FileCategory.profile:
        return `profile/${userId}/${uniqueFileName}`;

      case FileCategory.chatRoom:
        if (chatRoomId) {
          return `chatRoom/${chatRoomId}/${uniqueFileName}`;
        }
        return `temp/chatRoom/${userId}/${uniqueFileName}`;

      default:
        return `misc/${userId}/${uniqueFileName}`;
    }
  }

  private getFileUrl(bucket: string, fileKey: string): string {
    return `https://${bucket}.s3.${this.region}.amazonaws.com/${fileKey}`;
  }
}
