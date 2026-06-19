import { Injectable } from '@nestjs/common';
import * as path from 'path';

@Injectable()
export class StorageService {
  getFilePath(subdir: string, filename: string): string {
    const uploadDir = process.env.UPLOAD_DIR || './uploads';
    return path.join(uploadDir, subdir, filename);
  }
}
