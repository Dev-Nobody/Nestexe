// import {
//   Controller,
//   Post,
//   UploadedFile,
//   UseInterceptors,
// } from '@nestjs/common';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

// @Controller('images')
// export class ImageController {
//   constructor(private cloudinaryService: CloudinaryService) {}

//   @Post('upload')
//   @UseInterceptors(FileInterceptor('image'))
//   async uploadFile(@UploadedFile() file: Express.Multer.File) {
//     try {
//       const result = await this.cloudinaryService.uploadImage(file.path);
//       return result;
//     } catch (error) {
//       console.log('Error UpplaodingImage:', error);
//       throw new Error('Failed to upload iamge ');
//     }
//   }
// }

// import {
//   Controller,
//   Post,
//   UseInterceptors,
//   UploadedFile,
// } from '@nestjs/common';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { CloudinaryService } from './cloudinary/cloudinary.service';

// @Controller('upload')
// export class AppController {
//   constructor(private readonly cloudinary: CloudinaryService) {}

//   @Post('pic')
//   @UseInterceptors(FileInterceptor('file'))
//   async uploadImage(@UploadedFile() file: Express.Multer.File) {
//     return this.cloudinary.uploadImage(file);
//   }
// }
