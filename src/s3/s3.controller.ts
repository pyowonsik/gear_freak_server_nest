import { Body, Controller, Delete, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { S3Service } from './s3.service';
import { UserId } from '../common/decorator';
import {
  GeneratePresignedUrlDto,
  PresignedUrlResponseDto,
  DeleteFileDto,
} from './dto';

@Controller('s3')
@ApiTags('s3')
@ApiBearerAuth()
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}

  @Post('presigned-url')
  @ApiOperation({
    summary: '업로드용 Presigned URL 생성',
    description: 'S3에 파일을 업로드하기 위한 Presigned URL을 생성합니다.',
  })
  @ApiResponse({
    status: 201,
    description: 'Presigned URL 생성 성공',
    type: PresignedUrlResponseDto,
  })
  async generatePresignedUrl(
    @UserId() userId: number,
    @Body() dto: GeneratePresignedUrlDto,
  ): Promise<PresignedUrlResponseDto> {
    return this.s3Service.generatePresignedUploadUrl(userId, dto);
  }

  @Delete('file')
  @ApiOperation({
    summary: '파일 삭제',
    description: 'S3에서 파일을 삭제합니다.',
  })
  @ApiResponse({ status: 200, description: '파일 삭제 성공' })
  async deleteFile(@Body() dto: DeleteFileDto): Promise<{ message: string }> {
    await this.s3Service.deleteFile(dto.bucketType, dto.fileKey);
    return { message: '파일이 삭제되었습니다.' };
  }
}
