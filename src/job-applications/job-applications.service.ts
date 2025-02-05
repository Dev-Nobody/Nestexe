import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ApplicationDto, checkApplicationDto } from './dto/application.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JobApplicationsService {
  constructor(private prismaService: PrismaService) {}

  async jobApply(dto: ApplicationDto, userId: number) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });

    if (!user) throw new NotFoundException("User Doesn't Exist ");

    const job = await this.prismaService.job.findUnique({
      where: { id: dto.jobId },
    });

    if (!job) throw new NotFoundException("Job Doesn't Exist Anymore");

    const application = await this.prismaService.jobApplication.create({
      data: {
        userId,
        jobId: dto.jobId,
      },
    });

    return application;
  }

  async verifyApplication(dto: checkApplicationDto, userId: number) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user || user.role !== 'admin') {
      throw new ForbiddenException(
        'Access denied: Only admins can Check Applications.',
      );
    }

    const application = await this.prismaService.jobApplication.findUnique({
      where: { id: dto.ApplicationId },
    });

    if (!application) {
      throw new NotFoundException("Application Doesn't exist");
    }

    const id = dto.ApplicationId;

    const UpdatedApplication = await this.prismaService.jobApplication.update({
      where: { id },

      data: {
        applicationStatus: dto.applicationStatus,
      },
    });

    return UpdatedApplication;
  }
}
