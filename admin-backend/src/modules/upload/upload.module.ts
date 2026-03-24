import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { MinioService } from './minio.service';
import * as multer from 'multer';

@Module({
  imports: [
    MulterModule.register({
      storage: multer.memoryStorage(),
      // 配置 Multer 正确处理 UTF-8 编码的文件名
      fileFilter: (req, file, callback) => {
        // 修复文件名编码问题：将 Latin-1 编码的字节重新解释为 UTF-8
        if (file.originalname) {
          file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');
        }
        callback(null, true);
      },
    }),
  ],
  controllers: [UploadController],
  providers: [UploadService, MinioService],
  exports: [UploadService, MinioService],  // 👈 只导出 Service，不要导出 Controller
})
export class UploadModule {}