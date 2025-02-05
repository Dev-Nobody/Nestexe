import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateJobListingDto, UpdateJobListingDto } from './dto';

@Injectable()
export class JobManagementService {
  constructor(private prismaService: PrismaService) {}

  async createJob(dto: CreateJobListingDto, userId: any) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user || user.role !== 'admin') {
      throw new ForbiddenException(
        'Access denied: Only admins can create job listings.',
      );
    }

    const jobList = await this.prismaService.job.create({
      data: {
        title: dto.title,
        description: dto.description,
        requirements: dto.requirements,
        category: dto.category,
        location: dto.location,
        salaryMin: dto.salaryMin,
        salaryMax: dto.salaryMax,
      },
    });

    return jobList;
  }

  async updateJob(id: number, dto: UpdateJobListingDto) {
    const existingJob = await this.prismaService.job.findUnique({
      where: { id },
    });

    if (!existingJob) {
      throw new NotFoundException(`Job with ID ${id} not found.`);
    }

    const updatedJob = await this.prismaService.job.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
        requirements: dto.requirements,
        category: dto.category,
        location: dto.location,
        salaryMin: dto.salaryMin,
        salaryMax: dto.salaryMax,
      },
    });

    return updatedJob;
  }

  async getList() {
    const jobList = await this.prismaService.job.findMany();
    return jobList;
  }

  async searchJob(id: number) {
    const jobList = await this.prismaService.job.findUnique({
      where: { id },
    });
    if (!jobList) {
      throw new NotFoundException(`Not Found Try Another `);
    }
    return jobList;
  }

  async deleteJob(id: number) {
    const existingJob = await this.prismaService.job.findUnique({
      where: { id },
    });

    if (!existingJob) {
      throw new NotFoundException(`Job with ID ${id} not found.`);
    }

    await this.prismaService.job.delete({ where: { id } });

    return { message: 'Deleted Sucessfully' };
  }
}
