import {
  Body,
  Controller,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApplicationDto, checkApplicationDto } from './dto/application.dto';
import { JwtGuard } from 'src/job-management/guard';
import { JobApplicationsService } from './job-applications.service';

@Controller('job-applications')
export class JobApplicationsController {
  constructor(private jobApplications: JobApplicationsService) {}

  @Post('apply')
  @UseGuards(JwtGuard)
  apply(@Body() dto: ApplicationDto, @Request() req: any) {
    return this.jobApplications.jobApply(dto, req.user.id);
  }

  @Patch('check')
  @UseGuards(JwtGuard)
  ApplicationStatus(@Body() dto: checkApplicationDto, @Request() req: any) {
    return this.jobApplications.verifyApplication(dto, req.user.id);
  }
}
