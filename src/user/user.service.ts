import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { v2 as cloudinary } from 'cloudinary';
import { UpdateProfileDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async getMe(userId: number) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });

    if (!user) throw new NotFoundException("User Doesn\'t Exist");

    return user;
  }

  async updateProfile(
    userId: number,
    dto: UpdateProfileDto,
    profileImage?: Express.Multer.File,
  ) {
    // Upload profile image if provided
    let imageUrl: string | undefined;
    if (profileImage) {
      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { resource_type: 'image' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        );

        uploadStream.end(profileImage.buffer);
      });

      imageUrl = (uploadResult as any).secure_url;
    }

    // Update user in database
    return this.prismaService.user.update({
      where: { id: userId },
      data: {
        username: dto.username,
        email: dto.email,
        phoneNumber: dto.phoneNumber,
        profileImage: imageUrl || undefined,
      },
      select: {
        username: true,
        email: true,
        phoneNumber: true,
        profileImage: true,
      },
    });
  }
}
