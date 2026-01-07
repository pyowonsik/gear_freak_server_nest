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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3Controller = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const s3_service_1 = require("./s3.service");
const decorator_1 = require("../common/decorator");
const dto_1 = require("./dto");
let S3Controller = class S3Controller {
    s3Service;
    constructor(s3Service) {
        this.s3Service = s3Service;
    }
    async generatePresignedUrl(userId, dto) {
        return this.s3Service.generatePresignedUploadUrl(userId, dto);
    }
    async deleteFile(dto) {
        await this.s3Service.deleteFile(dto.bucketType, dto.fileKey);
        return { message: '파일이 삭제되었습니다.' };
    }
};
exports.S3Controller = S3Controller;
__decorate([
    (0, common_1.Post)('presigned-url'),
    (0, swagger_1.ApiOperation)({
        summary: '업로드용 Presigned URL 생성',
        description: 'S3에 파일을 업로드하기 위한 Presigned URL을 생성합니다.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Presigned URL 생성 성공',
        type: dto_1.PresignedUrlResponseDto,
    }),
    __param(0, (0, decorator_1.UserId)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, dto_1.GeneratePresignedUrlDto]),
    __metadata("design:returntype", Promise)
], S3Controller.prototype, "generatePresignedUrl", null);
__decorate([
    (0, common_1.Delete)('file'),
    (0, swagger_1.ApiOperation)({
        summary: '파일 삭제',
        description: 'S3에서 파일을 삭제합니다.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '파일 삭제 성공' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.DeleteFileDto]),
    __metadata("design:returntype", Promise)
], S3Controller.prototype, "deleteFile", null);
exports.S3Controller = S3Controller = __decorate([
    (0, common_1.Controller)('s3'),
    (0, swagger_1.ApiTags)('s3'),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [s3_service_1.S3Service])
], S3Controller);
//# sourceMappingURL=s3.controller.js.map