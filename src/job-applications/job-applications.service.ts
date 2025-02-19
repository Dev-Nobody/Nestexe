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

    // Check if the user has already applied for this job
    const existingApplication =
      await this.prismaService.jobApplication.findFirst({
        where: {
          userId,
          jobId: dto.jobId,
        },
      });

    if (existingApplication) {
      throw new ForbiddenException('You have already applied for this job');
    }

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
        include: { user: true, job: true },
      },
    );

    if (filteredApplicants.length === 0) {
      throw new NotFoundException(`No applicants found for job ID ${jobId}`);
    }

    return filteredApplicants;
  }

  async pendingApplicants() {
    const pendingApplicants = await this.prismaService.jobApplication.findMany({
      where: { applicationStatus: 'Pending' },
    });

    if (!pendingApplicants || pendingApplicants.length === 0) {
      throw new NotFoundException('No Pending Applicants Found');
    }

    return pendingApplicants;
  }

  async shortlistedApplicants() {
    const shortlistedApplicants =
      await this.prismaService.jobApplication.findMany({
        where: { applicationStatus: 'Shortlisted' },
      });

    if (!shortlistedApplicants || shortlistedApplicants.length === 0) {
      throw new NotFoundException('No Shortlisted Applicants Found');
    }

    return shortlistedApplicants;
  }

  async getPendingApplications(id: number) {
    const applications = await this.prismaService.jobApplication.findMany({
      where: {
        userId: id, // Match the user ID
        applicationStatus: 'pending', // Match the application status
      },
    });

    if (!applications) {
      throw new Error('Application not found or status does not match');
    }

    return applications;
  }

  async getScheduledApplications(id: number) {
    const applications = await this.prismaService.jobApplication.findMany({
      where: {
        userId: id,
        applicationStatus: 'Shortlisted', // Match the application status
      },
    });

    if (!applications) {
      throw new Error('Application not found or status does not match');
    }

    return applications;
  }

  async appliedJobs(id: number) {
    const appliedJobs = await this.prismaService.jobApplication.findMany({
      where: {
        userId: id,
      },
      include: { job: true },
    });

    if (!appliedJobs) throw new ForbiddenException('Applied for No Job');

    return appliedJobs;
  }
}
