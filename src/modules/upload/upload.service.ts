import { Injectable } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Injectable()
export class UploadService {
  private readonly domain = 'http://127.0.0.1:7768'; // 替换为您的实际域名

  uploadFile(file: Express.Multer.File): string {
    // 处理文件存储逻辑
    const filePath = `resources/${file.filename}`;
    // 返回完整的文件URL
    return `${this.domain}/${filePath}`;
  }
}
