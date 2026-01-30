/**
 * @file fileStorage.ts
 * @author Balaji Koneti
 * @linkedin https://www.linkedin.com/in/balaji-koneti/
 * @github https://github.com/KonetiBalaji/kwalifai
 * 
 * Copyright (C) 2026 Balaji Koneti
 * All Rights Reserved.
 * 
 * This software is proprietary and confidential.
 * Unauthorized copying, modification, distribution, or use is prohibited.
 */

import { Express } from 'express';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import fs from 'fs';

export interface StoredFile {
  filename: string;
  originalName: string;
  path: string;
  size: number;
  mimetype: string;
}

export interface FileStorageProvider {
  getMulterMiddleware(): Express.Multer.Multer;
  getStorageType(): string;
}

/**
 * Local filesystem storage provider
 * Matches legacy behavior: stores files in uploads/ directory
 */
export class LocalFileStorageProvider implements FileStorageProvider {
  private uploadsDir: string;
  private multerInstance: Express.Multer.Multer;

  constructor(uploadsDir: string = path.join(process.cwd(), 'uploads')) {
    this.uploadsDir = uploadsDir;
    this.ensureUploadsDirectory();
    this.multerInstance = this.createMulterInstance();
  }

  private ensureUploadsDirectory(): void {
    if (!fs.existsSync(this.uploadsDir)) {
      fs.mkdirSync(this.uploadsDir, { recursive: true });
    }
  }

  private createMulterInstance(): Express.Multer.Multer {
    const storage = multer.diskStorage({
      destination: (_req, _file, cb) => {
        cb(null, this.uploadsDir);
      },
      filename: (_req, file, cb) => {
        // Match legacy naming: mortgage-statement-{timestamp}-{random}.{ext}
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname);
        cb(null, `mortgage-statement-${uniqueSuffix}${extension}`);
      },
    });

    const fileFilter = (
      _req: Express.Request,
      file: Express.Multer.File,
      cb: FileFilterCallback
    ) => {
      // Match legacy allowed types
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Only PDF, JPEG, JPG, and PNG files are allowed'));
      }
    };

    return multer({
      storage,
      fileFilter,
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB - matches legacy
    });
  }

  getMulterMiddleware(): Express.Multer.Multer {
    return this.multerInstance;
  }

  getStorageType(): string {
    return 'local';
  }
}

/**
 * Factory function to create storage provider
 * Future: Can return S3Provider, GCSProvider, etc. based on env vars
 */
export function createFileStorageProvider(): FileStorageProvider {
  const storageType = process.env.FILE_STORAGE_TYPE || 'local';
  
  if (storageType === 'local') {
    const uploadsDir = process.env.UPLOADS_DIR || path.join(process.cwd(), 'uploads');
    return new LocalFileStorageProvider(uploadsDir);
  }
  
  // Future: Add S3, GCS providers here
  throw new Error(`Unsupported storage type: ${storageType}`);
}
