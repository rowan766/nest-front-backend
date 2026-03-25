import {
  Controller,
  Post,
  Get,
  Delete,
  UseInterceptors,
  UploadedFiles,
  UseGuards,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  Query,
  Res,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody, ApiBearerAuth, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { UploadService } from './upload.service';
import { JwtAuthGuard, CurrentUser } from '../auth';
import type { Response } from 'express';

@ApiTags('文件上传')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  // ========== 上传接口 ==========

  // 上传图片（支持多文件）
  @Post('images')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('Authorization')
  @UseInterceptors(FilesInterceptor('files', 10)) // 最多10张图片
  @ApiOperation({ summary: '上传图片（支持多文件）' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: '上传成功，返回文件ID和信息数组',
    schema: {
      example: [
        { id: 1, name: '图片1.jpg', url: 'http://...', size: 123456, mimeType: 'image/jpeg' },
        { id: 2, name: '图片2.png', url: 'http://...', size: 234567, mimeType: 'image/png' }
      ]
    }
  })
  async uploadImages(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 每张5MB
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif|webp|svg)$/i }),
        ],
      }),
    )
    files: Express.Multer.File[],
    @CurrentUser() user: any,
  ) {
    return await this.uploadService.uploadImages(files, user.id);
  }

  // 上传文件（支持多文件）
  @Post('files')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('Authorization')
  @UseInterceptors(FilesInterceptor('files', 10)) // 最多10个文件
  @ApiOperation({ summary: '上传文件（支持多文件）' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: '上传成功，返回文件ID和信息数组',
    schema: {
      example: [
        { id: 3, name: '文档.pdf', url: 'http://...', size: 345678, mimeType: 'application/pdf' }
      ]
    }
  })
  async uploadFiles(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 100 * 1024 * 1024 }), // 每个100MB
        ],
      }),
    )
    files: Express.Multer.File[],
    @CurrentUser() user: any,
  ) {
    return await this.uploadService.uploadFiles(files, user.id);
  }

  // ========== 查询接口 ==========

  // 根据文件ID获取文件信息
  @Get('file/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('Authorization')
  @ApiOperation({ summary: '根据文件ID获取文件信息' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async getFileById(@Param('id', ParseIntPipe) id: number) {
    return await this.uploadService.getFileById(id);
  }

  // 批量获取文件信息
  @Post('files/batch')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('Authorization')
  @ApiOperation({ summary: '批量获取文件信息' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        fileIds: {
          type: 'array',
          items: { type: 'number' },
          example: [1, 2, 3],
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: '获取成功' })
  async getFilesByIds(@Body() body: { fileIds: number[] }) {
    return await this.uploadService.getFilesByIds(body.fileIds);
  }

  // ========== 下载/预览接口 ==========

  // 预览或下载图片（无需认证，可直接用于img标签）
  @Get('image/:id')
  @ApiOperation({ summary: '预览或下载图片（无需认证）' })
  @ApiQuery({
    name: 'download',
    description: '是否下载（false则在浏览器中预览）',
    required: false,
    type: Boolean,
    example: false,
  })
  @ApiResponse({ status: 200, description: '获取成功' })
  async viewOrDownloadImage(
    @Param('id', ParseIntPipe) id: number,
    @Query('download') download: string = 'false',
    @Res() res: Response,
  ): Promise<void> {
    const shouldDownload = download === 'true';
    const result = await this.uploadService.viewOrDownloadImage(id, shouldDownload);

    res.set({
      'Content-Type': result.contentType,
      'Content-Disposition': result.contentDisposition,
    });

    result.stream.pipe(res);
  }

  // 下载文件
  @Get('file/:id/download')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('Authorization')
  @ApiOperation({ summary: '下载文件' })
  @ApiResponse({ status: 200, description: '下载成功' })
  async downloadFile(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ): Promise<void> {
    const result = await this.uploadService.downloadFileById(id);

    res.set({
      'Content-Type': result.contentType,
      'Content-Disposition': result.contentDisposition,
    });

    result.stream.pipe(res);
  }

  // 删除文件或图片
  @Delete('file/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('Authorization')
  @ApiOperation({ summary: '删除文件或图片' })
  @ApiResponse({ status: 200, description: '删除成功' })
  async removeFile(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
  ) {
    return await this.uploadService.removeFileById(id, user);
  }
}
