import { Module } from '@nestjs/common';
import { JobApplicationsController } from './job-applications.controller';
import { JobApplicationsService } from './job-applications.service';
import { JwtStrategy } from 'src/job-management/strategy';

@Module({
  controllers: [JobApplicationsController],
  providers: [JobApplicationsService, JwtStrategy],
})
export class JobApplicationsModule {}
