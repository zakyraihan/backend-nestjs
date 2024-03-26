// file.validator.ts
import { extname } from 'path';
import { HttpException, HttpStatus } from '@nestjs/common';

export class FileValidator {
  static validateFile(
    file: Express.Multer.File,
    allowedExtensions: string[],
    maxSizeInBytes: number,
  ): void {
    const fileExtension = extname(file.originalname).toLowerCase();

    if (!allowedExtensions.includes(fileExtension)) {
      throw new HttpException(
        'file harus bertipe jpg dan pdf',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (file.size > maxSizeInBytes) {
      throw new HttpException(
        `File size exceeds ${maxSizeInBytes / (1024 * 1024)}MB limit.`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
