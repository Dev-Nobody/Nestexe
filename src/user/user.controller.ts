import {
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
  @UseInterceptors(FileInterceptor('img'))
  updateProfile(
    @Request() req: any,
    @Body() updateProfileDto: UpdateProfileDto,
    @UploadedFile() profileImage?: Express.Multer.File,
  ) {
    console.log('Received File:', profileImage);
    console.log('Received Body:', updateProfileDto);

    return this.userService.updateProfile(
      req.user.id,
      updateProfileDto,
      profileImage,
    );
  }
}
