import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateJobListingDto, UpdateJobListingDto } from './dto';
import { JobManagementService } from './job-management.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtGuard } from './guard';
import { SkipThrottle } from '@nestjs/throttler';

@SkipThrottle()
@Controller('job-management')
export class JobManagementController {
  constructor(private jobManagement: JobManagementService) {}

  @Post('create')
  @UseGuards(JwtGuard)
  createJob(@Body() createJobList: CreateJobListingDto, @Request() req: any) {
    return this.jobManagement.createJob(createJobList, req.user.id);
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  updateJob(@Param('id') id: number, @Body() dto: UpdateJobListingDto) {
    return this.jobManagement.updateJob(Number(id), dto);
  }

  @Get('get-list')
  getJobList() {
    return this.jobManagement.getList();
  }

  @Get('search/:id')
  searchJob(@Param('id') id: number) {
    return this.jobManagement.searchJob(Number(id));
  }

  @Delete('delete-job/:id')
  deleteJob(@Param('id') id: number) {
    return this.jobManagement.deleteJob(Number(id));
  }
}
