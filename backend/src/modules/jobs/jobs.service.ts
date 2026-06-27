import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { JobStatus } from '../../database/entities/enums';
import { Job } from '../../database/entities/job.entity';
import { CreateJobDto, JobFilterDto, UpdateJobDto } from './dto/job.dto';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private readonly jobsRepo: Repository<Job>,
  ) {}

  async create(userId: string, companyName: string, dto: CreateJobDto) {
    const job = this.jobsRepo.create({
      ...dto,
      postedByUserId: userId,
      companyName,
      status: JobStatus.ACTIVE,
      postedAt: new Date(),
      salaryCurrency: dto.salaryCurrency || 'USD',
      tags: [],
    });
    return this.jobsRepo.save(job);
  }

  async findAll(filter: JobFilterDto, userId?: string) {
    const qb = this.jobsRepo
      .createQueryBuilder('job')
      .where('job.status = :status', { status: JobStatus.ACTIVE });

    if (filter.search) {
      qb.andWhere(
        '(job.title LIKE :search OR job.description LIKE :search OR job.companyName LIKE :search)',
        { search: `%${filter.search}%` },
      );
    }
    if (filter.jobType) qb.andWhere('job.jobType = :jobType', { jobType: filter.jobType });
    if (filter.workplaceType) {
      qb.andWhere('job.workplaceType = :workplaceType', {
        workplaceType: filter.workplaceType,
      });
    }
    if (filter.location) {
      qb.andWhere('job.location LIKE :location', { location: `%${filter.location}%` });
    }
    if (filter.salaryMin) {
      qb.andWhere('job.salaryMax >= :salaryMin', { salaryMin: filter.salaryMin });
    }

    const limit = filter.limit ?? 20;
    const offset = filter.offset ?? 0;
    const [items, total] = await qb
      .orderBy('job.postedAt', 'DESC')
      .skip(offset)
      .take(limit)
      .getManyAndCount();

    if (userId) {
      return { items: await this.attachBookmarkStatus(items, userId), total, limit, offset };
    }
    return { items, total, limit, offset };
  }

  async findById(id: string, userId?: string) {
    const job = await this.jobsRepo.findOne({ where: { id } });
    if (!job) throw new NotFoundException('Job not found');
    await this.jobsRepo.increment({ id }, 'viewsCount', 1);
    if (userId) {
      const [withBookmark] = await this.attachBookmarkStatus([job], userId);
      return withBookmark;
    }
    return job;
  }

  async findByUser(userId: string) {
    return this.jobsRepo.find({
      where: { postedByUserId: userId },
      order: { createdAt: 'DESC' },
    });
  }

  async update(jobId: string, userId: string, dto: UpdateJobDto) {
    const job = await this.findOwnedJob(jobId, userId);
    Object.assign(job, dto);
    return this.jobsRepo.save(job);
  }

  async close(jobId: string, userId: string) {
    const job = await this.findOwnedJob(jobId, userId);
    job.status = JobStatus.CLOSED;
    return this.jobsRepo.save(job);
  }

  async remove(jobId: string, userId: string) {
    const job = await this.findOwnedJob(jobId, userId);
    await this.jobsRepo.softRemove(job);
    return { message: 'Job deleted' };
  }

  async getAnalytics(jobId: string, userId: string) {
    const job = await this.findOwnedJob(jobId, userId);
    return {
      jobId: job.id,
      title: job.title,
      applicationsCount: job.applicationsCount,
      viewsCount: job.viewsCount,
      status: job.status,
      postedAt: job.postedAt,
      conversionRate:
        job.viewsCount > 0
          ? Math.round((job.applicationsCount / job.viewsCount) * 10000) / 100
          : 0,
    };
  }

  search(query: string) {
    return this.jobsRepo.find({
      where: [
        { title: Like(`%${query}%`) },
        { description: Like(`%${query}%`) },
        { companyName: Like(`%${query}%`) },
      ],
      take: 20,
    });
  }

  incrementApplications(jobId: string) {
    return this.jobsRepo.increment({ id: jobId }, 'applicationsCount', 1);
  }

  private async findOwnedJob(jobId: string, userId: string) {
    const job = await this.jobsRepo.findOne({ where: { id: jobId } });
    if (!job) throw new NotFoundException('Job not found');
    if (job.postedByUserId !== userId) {
      throw new ForbiddenException('You do not own this job');
    }
    return job;
  }

  private async attachBookmarkStatus(jobs: Job[], _userId: string) {
    return jobs.map((job) => ({ ...job, isBookmarked: false }));
  }
}
