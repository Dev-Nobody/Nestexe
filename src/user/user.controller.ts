import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Put,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtGuard } from 'src/job-management/guard';
import { UserService } from './user.service';
import { UpdateProfileDto } from './dto/user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { imageFileFilter } from './filter/file.filter';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('get-me')
  @UseGuards(JwtGuard)
  getMe(@Request() req: any) {
    return this.userService.getMe(req.user.id);
  }

  @Put('update-profile')
  @UseGuards(JwtGuard)
  @UseInterceptors(
    FileInterceptor('img', {
      fileFilter: imageFileFilter,
    }),
  )
  async updateProfile(
    @Request() req: any,
    @Body() updateProfileDto: UpdateProfileDto,
    @UploadedFile() profileImage?: Express.Multer.File,
  ) {
    if (req.fileValidationError) {
      return req.res.status(400).json({
        success: false,
        message: req.fileValidationError, // Responding with validation error
      });
    }

    if (!profileImage) {
      return req.res.status(400).json({
        success: false,
        message: 'Invalid file type. Only JPG and PNG are allowed.', // Respond if file is missing
      });
    }

    // If validation passes, update the profile
    try {
      const updatedUser = await this.userService.updateProfile(
        req.user.id,
        updateProfileDto,
        profileImage,
      );

      return req.res.status(200).json({
        success: true,
        message: 'Profile updated successfully!', // Success message
        data: updatedUser, // The updated user data
      });
    } catch (error) {
      // In case something goes wrong in the service layer
      return req.res.status(500).json({
        success: false,
        message: 'An error occurred while updating the profile.',
      });
    }
  }
}
