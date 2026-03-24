import { Injectable, NotFoundException } from '@nestjs/common';
import { MinioService } from './minio.service';
import { PrismaService } from '../../infrastructure';

@Injectable()
export class UploadService {
  constructor(
    private minioService: MinioService,
    private prisma: PrismaService,
  ) {}

  // 上传图片（支持单个或多个）
  async uploadImages(files: Express.Multer.File[], userId: number) {
    const bucketType = 'userAvatar'; // 统一使用 userAvatar 桶存储图片
    const folder = 'images';

    const uploadResults: Array<{
      id: number;
      name: string;
      url: string;
      size: number;
      mimeType: string;
    }> = [];

    for (const file of files) {
      // 上传到 MinIO
      const uploadResult = await this.minioService.uploadFile(file, bucketType, folder);

      // 保存文件记录到数据库
      const fileRecord = await this.prisma.file.create({
        data: {
          userId,
          bucketName: uploadResult.bucket,
          bucketType: bucketType, // 保存实际的桶类型
          folder,
          fileName: uploadResult.fileName,
          originalName: uploadResult.originalName,
          fileSize: uploadResult.size,
          mimeType: uploadResult.mimetype,
          fileUrl: uploadResult.url,
        },
      });

      uploadResults.push({
        id: fileRecord.id,
        name: uploadResult.originalName,
        url: uploadResult.url,
        size: uploadResult.size,
        mimeType: uploadResult.mimetype,
      });
    }

    return uploadResults;
  }

  // 上传文件（支持单个或多个）
  async uploadFiles(files: Express.Multer.File[], userId: number) {
    const bucketType = 'document';
    const folder = 'files';

    const uploadResults: Array<{
      id: number;
      name: string;
      url: string;
      size: number;
      mimeType: string;
    }> = [];

    for (const file of files) {
      // 上传到 MinIO
      const uploadResult = await this.minioService.uploadFile(file, bucketType, folder);

      // 保存文件记录到数据库
      const fileRecord = await this.prisma.file.create({
        data: {
          userId,
          bucketName: uploadResult.bucket,
          bucketType: bucketType, // 保存实际的桶类型
          folder,
          fileName: uploadResult.fileName,
          originalName: uploadResult.originalName,
          fileSize: uploadResult.size,
          mimeType: uploadResult.mimetype,
          fileUrl: uploadResult.url,
        },
      });

      uploadResults.push({
        id: fileRecord.id,
        name: uploadResult.originalName,
        url: uploadResult.url,
        size: uploadResult.size,
        mimeType: uploadResult.mimetype,
      });
    }

    return uploadResults;
  }


  // 映射 bucketType（兼容旧数据）
  private mapBucketType(bucketType: string): 'userAvatar' | 'product' | 'document' | 'archive' | 'common' {
    // 兼容旧的 bucketType
    const mapping: Record<string, 'userAvatar' | 'product' | 'document' | 'archive' | 'common'> = {
      image: 'userAvatar',
      file: 'document',
      userAvatar: 'userAvatar',
      product: 'product',
      document: 'document',
      archive: 'archive',
      common: 'common',
    };

    return mapping[bucketType] || 'common';
  }

  // 根据文件ID获取文件信息（用于查询文件详情）
  async getFileById(fileId: number) {
    const file = await this.prisma.file.findUnique({
      where: { id: fileId, status: 1 },
    });

    if (!file) {
      throw new NotFoundException('文件不存在或已被删除');
    }

    return {
      id: file.id,
      name: file.originalName,
      fileName: file.fileName,
      bucketType: file.bucketType,
      size: file.fileSize,
      mimeType: file.mimeType,
    };
  }

  // 批量获取文件信息（用于业务表关联查询）
  async getFilesByIds(fileIds: number[]) {
    if (!fileIds || fileIds.length === 0) {
      return [];
    }

    const files = await this.prisma.file.findMany({
      where: {
        id: { in: fileIds },
        status: 1,
      },
      orderBy: { createdAt: 'desc' },
    });

    return files.map(file => ({
      id: file.id,
      name: file.originalName,
      fileName: file.fileName,
      bucketType: file.bucketType,
      size: file.fileSize,
      mimeType: file.mimeType,
    }));
  }

  // 预览或下载图片（根据文件ID）
  async viewOrDownloadImage(fileId: number, download: boolean = false) {
    const file = await this.prisma.file.findUnique({
      where: { id: fileId, status: 1 },
    });

    if (!file) {
      throw new NotFoundException('图片不存在');
    }

    // 映射 bucketType（兼容旧数据）
    const bucketType = this.mapBucketType(file.bucketType);

    // 获取文件流
    const stream = await this.minioService.getFileStream(file.fileName, bucketType);

    // 获取文件元数据
    const metadata = await this.minioService.getFileMetadata(file.fileName, bucketType);

    // 根据 download 参数决定 Content-Disposition
    const contentDisposition = download
      ? `attachment; filename="${encodeURIComponent(file.originalName)}"; filename*=UTF-8''${encodeURIComponent(file.originalName)}`
      : `inline; filename="${encodeURIComponent(file.originalName)}"; filename*=UTF-8''${encodeURIComponent(file.originalName)}`;

    return {
      stream,
      contentType: metadata.metaData['content-type'] || file.mimeType,
      contentDisposition,
    };
  }

  // 下载文件（根据文件ID）
  async downloadFileById(fileId: number) {
    const file = await this.prisma.file.findUnique({
      where: { id: fileId, status: 1 },
    });

    if (!file) {
      throw new NotFoundException('文件不存在');
    }

    // 映射 bucketType（兼容旧数据）
    const bucketType = this.mapBucketType(file.bucketType);

    // 获取文件流
    const stream = await this.minioService.getFileStream(file.fileName, bucketType);

    // 获取文件元数据
    const metadata = await this.minioService.getFileMetadata(file.fileName, bucketType);

    return {
      stream,
      contentType: metadata.metaData['content-type'] || file.mimeType,
      contentDisposition: `attachment; filename="${encodeURIComponent(file.originalName)}"; filename*=UTF-8''${encodeURIComponent(file.originalName)}`,
    };
  }
}
