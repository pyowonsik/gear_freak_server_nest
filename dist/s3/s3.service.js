"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3Service = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const uuid_1 = require("uuid");
const env_const_1 = require("../common/const/env.const");
const dto_1 = require("./dto");
let S3Service = class S3Service {
    configService;
    s3Client;
    publicBucket;
    privateBucket;
    region;
    constructor(configService) {
        this.configService = configService;
        this.region = configService.get(env_const_1.envVariableKeys.awsRegion) || 'ap-northeast-2';
        this.publicBucket = configService.get(env_const_1.envVariableKeys.s3PublicBucket) || '';
        this.privateBucket = configService.get(env_const_1.envVariableKeys.s3PrivateBucket) || '';
        this.s3Client = new client_s3_1.S3Client({
            region: this.region,
            credentials: {
                accessKeyId: configService.get(env_const_1.envVariableKeys.awsAccessKeyId) || '',
                secretAccessKey: configService.get(env_const_1.envVariableKeys.awsSecretAccessKey) || '',
            },
        });
    }
    async generatePresignedUploadUrl(userId, dto) {
        const { bucketType, fileCategory, fileName, contentType, productId, chatRoomId } = dto;
        const bucket = this.getBucket(bucketType);
        const fileKey = this.generateFileKey(fileCategory, userId, fileName, productId, chatRoomId);
        const command = new client_s3_1.PutObjectCommand({
            Bucket: bucket,
            Key: fileKey,
            ContentType: contentType,
        });
        const uploadUrl = await (0, s3_request_presigner_1.getSignedUrl)(this.s3Client, command, {
            expiresIn: 3600,
        });
        const fileUrl = this.getFileUrl(bucket, fileKey);
        return {
            uploadUrl,
            fileUrl,
            fileKey,
        };
    }
    async deleteFile(bucketType, fileKey) {
        const bucket = this.getBucket(bucketType);
        const command = new client_s3_1.DeleteObjectCommand({
            Bucket: bucket,
            Key: fileKey,
        });
        await this.s3Client.send(command);
    }
    async moveFile(bucketType, sourceKey, destKey) {
        const bucket = this.getBucket(bucketType);
        const copyCommand = new client_s3_1.CopyObjectCommand({
            Bucket: bucket,
            CopySource: `${bucket}/${sourceKey}`,
            Key: destKey,
        });
        await this.s3Client.send(copyCommand);
        const deleteCommand = new client_s3_1.DeleteObjectCommand({
            Bucket: bucket,
            Key: sourceKey,
        });
        await this.s3Client.send(deleteCommand);
        return this.getFileUrl(bucket, destKey);
    }
    async deleteFiles(bucketType, fileKeys) {
        await Promise.all(fileKeys.map((fileKey) => this.deleteFile(bucketType, fileKey)));
    }
    extractFileKeyFromUrl(url) {
        try {
            const urlObj = new URL(url);
            return urlObj.pathname.slice(1);
        }
        catch {
            return null;
        }
    }
    getBucket(bucketType) {
        return bucketType === dto_1.BucketType.public
            ? this.publicBucket
            : this.privateBucket;
    }
    generateFileKey(category, userId, fileName, productId, chatRoomId) {
        const uuid = (0, uuid_1.v4)();
        const extension = fileName.split('.').pop() || '';
        const uniqueFileName = `${uuid}.${extension}`;
        switch (category) {
            case dto_1.FileCategory.product:
                if (productId) {
                    return `product/${productId}/${uniqueFileName}`;
                }
                return `temp/product/${userId}/${uniqueFileName}`;
            case dto_1.FileCategory.profile:
                return `profile/${userId}/${uniqueFileName}`;
            case dto_1.FileCategory.chatRoom:
                if (chatRoomId) {
                    return `chatRoom/${chatRoomId}/${uniqueFileName}`;
                }
                return `temp/chatRoom/${userId}/${uniqueFileName}`;
            default:
                return `misc/${userId}/${uniqueFileName}`;
        }
    }
    getFileUrl(bucket, fileKey) {
        return `https://${bucket}.s3.${this.region}.amazonaws.com/${fileKey}`;
    }
};
exports.S3Service = S3Service;
exports.S3Service = S3Service = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], S3Service);
//# sourceMappingURL=s3.service.js.map