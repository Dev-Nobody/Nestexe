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

    const updatedJob = await this.prismaService.job.update({
      where: { id: dto.jobId },
      data: {
        applicants: {
          increment: 1,
        },
      },
    });

    console.log('After updating applicants:', updatedJob.applicants);

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
  async applicantsList() {
    const applicantsList = await this.prismaService.jobApplication.findMany();
    if (!applicantsList)
      throw new NotFoundException("Apllicants Doesn't Exist ");
    return applicantsList;
  }

  async searchApplicant(jobId: number) {
    const filteredApplicants = await this.prismaService.jobApplication.findMany(
      {
        where: {
          jobId: jobId,
        },
      },
    );

    if (filteredApplicants.length === 0) {
      throw new NotFoundException(`No applicants found for job ID ${jobId}`);
    }

    return filteredApplicants;
  }
}
