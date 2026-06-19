import { diskStorage, Options } from 'multer';

export function createDiskStorageConfig(subdir: string): Options {
  return {
    storage: diskStorage({
      destination: (process.env.UPLOAD_DIR || './uploads') + `/${subdir}`,
      filename: (_req, file, cb) =>
        cb(null, `${Date.now()}-${file.originalname.replace(/\s/g, '_')}`),
    }),
  };
}
