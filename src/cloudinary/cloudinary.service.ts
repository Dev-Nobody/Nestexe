import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: 'auto' },
        (error, result) => {
          if (error || !result) {
            return reject(
              new Error(
                `Cloudinary upload failed: ${error?.message || 'Unknown error'}`,
              ),
            );
          }
          resolve(result);
        },
      );

      uploadStream.end(file.buffer);
    });
  }
}
