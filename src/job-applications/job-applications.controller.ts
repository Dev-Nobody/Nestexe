import {
  Body,
  Controller,
  Get,
  Param,
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

  @Get('getApplicants')
  // @UseGuards(JwtGuard)
  getList() {
    return this.jobApplications.applicantsList();
  }
  @Get('search/:id')
  async searchJob(@Param('id') id: string) {
    // Ensure id is treated as a string
    return this.jobApplications.searchApplicant(Number(id)); // Convert id to number
  }
}
