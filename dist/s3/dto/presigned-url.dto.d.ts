export declare enum BucketType {
    public = "public",
    private = "private"
}
export declare enum FileCategory {
    product = "product",
    profile = "profile",
    chatRoom = "chatRoom"
}
export declare class GeneratePresignedUrlDto {
    bucketType: BucketType;
    fileCategory: FileCategory;
    fileName: string;
    contentType: string;
    productId?: number;
    chatRoomId?: number;
}
export declare class PresignedUrlResponseDto {
    uploadUrl: string;
    fileUrl: string;
    fileKey: string;
}
export declare class DeleteFileDto {
    bucketType: BucketType;
    fileKey: string;
}
