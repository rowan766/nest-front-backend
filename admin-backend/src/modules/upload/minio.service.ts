import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'minio';

@Injectable()
export class MinioService implements OnModuleInit {
  private minioClient: Client;
  
  // 不同业务模块的桶名
  private buckets = {
    userAvatar: '',
    product: '',
    document: '',
    archive: '',
    common: '',
  };

  constructor(private configService: ConfigService) {
    this.minioClient = new Client({
      endPoint: this.configService.get('MINIO_ENDPOINT') || 'localhost',
      port: parseInt(this.configService.get('MINIO_PORT') || '9000'),
      useSSL: this.configService.get('MINIO_USE_SSL') === 'true',
      accessKey: this.configService.get('MINIO_ACCESS_KEY') || 'admin',
      secretKey: this.configService.get('MINIO_SECRET_KEY') || '12345678',
    });

    // 从环境变量读取桶名
    this.buckets.userAvatar = this.configService.get('MINIO_BUCKET_USER_AVATAR') || 'user-avatars';
    this.buckets.product = this.configService.get('MINIO_BUCKET_PRODUCT') || 'product-images';
    this.buckets.document = this.configService.get('MINIO_BUCKET_DOCUMENT') || 'documents';
    this.buckets.archive = this.configService.get('MINIO_BUCKET_ARCHIVE') || 'archives';
    this.buckets.common = this.configService.get('MINIO_BUCKET_COMMON') || 'common-files';
  }

  async onModuleInit() {
    // 确保所有桶都存在
    for (const bucketName of Object.values(this.buckets)) {
      await this.ensureBucketExists(bucketName);
    }
  }

  // 确保桶存在
  private async ensureBucketExists(bucketName: string) {
    const exists = await this.minioClient.bucketExists(bucketName);
    if (!exists) {
      await this.minioClient.makeBucket(bucketName, 'us-east-1');
      console.log(`✅ MinIO 桶 "${bucketName}" 创建成功`);
    }
  }

  // 上传文件
  async uploadFile(
    file: Express.Multer.File,
    bucketType: 'userAvatar' | 'product' | 'document' | 'archive' | 'common',
    folder: string = 'default',
  ) {
    const bucketName = this.buckets[bucketType];

    // 生成唯一文件名（保留原始中文文件名）
    const fileName = `${folder}/${Date.now()}-${file.originalname}`;

    // 对文件名进行 URL 编码，仅用于 HTTP 响应头
    const encodedOriginalName = encodeURIComponent(file.originalname);

    // 上传到 MinIO
    await this.minioClient.putObject(
      bucketName,
      fileName,
      file.buffer,
      file.size,
      {
        'Content-Type': file.mimetype,
        // 添加 Content-Disposition 头，确保下载时文件名正确显示
        'Content-Disposition': `attachment; filename="${encodedOriginalName}"; filename*=UTF-8''${encodedOriginalName}`,
      },
    );

    // 生成访问 URL（预签名 URL，7天有效）
    const url = await this.minioClient.presignedGetObject(
      bucketName,
      fileName,
      7 * 24 * 60 * 60,
    );

    return {
      bucket: bucketName,
      fileName,
      originalName: file.originalname, // 返回原始文件名供前端显示
      url,
      size: file.size,
      mimetype: file.mimetype,
    };
  }

  // 删除文件
  async deleteFile(fileName: string, bucketType: 'userAvatar' | 'product' | 'document' | 'archive' | 'common') {
    const bucketName = this.buckets[bucketType];
    await this.minioClient.removeObject(bucketName, fileName);
  }

  // 获取文件访问 URL
  async getFileUrl(fileName: string, bucketType: 'userAvatar' | 'product' | 'document' | 'archive' | 'common') {
    const bucketName = this.buckets[bucketType];
    return await this.minioClient.presignedGetObject(
      bucketName,
      fileName,
      7 * 24 * 60 * 60,
    );
  }

  // 获取桶名（供外部查询）
  getBucketName(bucketType: 'userAvatar' | 'product' | 'document' | 'archive' | 'common'): string {
    return this.buckets[bucketType];
  }

  // 获取文件流（用于下载）
  async getFileStream(fileName: string, bucketType: 'userAvatar' | 'product' | 'document' | 'archive' | 'common') {
    const bucketName = this.buckets[bucketType];
    return await this.minioClient.getObject(bucketName, fileName);
  }

  // 获取文件元数据
  async getFileMetadata(fileName: string, bucketType: 'userAvatar' | 'product' | 'document' | 'archive' | 'common') {
    const bucketName = this.buckets[bucketType];
    return await this.minioClient.statObject(bucketName, fileName);
  }

  // 检查文件是否存在
  async fileExists(fileName: string, bucketType: 'userAvatar' | 'product' | 'document' | 'archive' | 'common'): Promise<boolean> {
    try {
      const bucketName = this.buckets[bucketType];
      await this.minioClient.statObject(bucketName, fileName);
      return true;
    } catch (error) {
      return false;
    }
  }
}