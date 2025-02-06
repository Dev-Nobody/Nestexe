import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/job-management/guard';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('get-me')
  @UseGuards(JwtGuard)
  getMe(@Request() req: any) {
    return this.userService.getMe(req.user.id);
  }
}
