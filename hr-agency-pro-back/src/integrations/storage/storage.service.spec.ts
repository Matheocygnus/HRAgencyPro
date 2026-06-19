import { StorageService } from './storage.service';
import * as path from 'path';

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(() => {
    service = new StorageService();
  });

  describe('getFilePath', () => {
    it('returns a path combining uploadDir, subdir, and filename', () => {
      const result = service.getFilePath('prospects', 'resume.pdf');
      expect(result).toContain('prospects');
      expect(result).toContain('resume.pdf');
    });

    it('uses UPLOAD_DIR env variable when set', () => {
      process.env.UPLOAD_DIR = '/custom/uploads';
      const result = service.getFilePath('contracts', 'doc.pdf');
      expect(result).toBe(path.join('/custom/uploads', 'contracts', 'doc.pdf'));
      delete process.env.UPLOAD_DIR;
    });

    it('falls back to ./uploads when UPLOAD_DIR is not set', () => {
      delete process.env.UPLOAD_DIR;
      const result = service.getFilePath('jobs', 'cv.pdf');
      expect(result).toBe(path.join('./uploads', 'jobs', 'cv.pdf'));
    });
  });
});
