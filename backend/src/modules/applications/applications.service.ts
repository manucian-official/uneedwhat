import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApplicationStatus } from '../../database/entities/enums';
import { Application } from '../../database/entities/application.entity';
import { JobsService } from '../jobs/jobs.service';
import {
  BulkUpdateApplicationsDto,
  CreateApplicationDto,
  UpdateApplicationStatusDto,
} from './dto/application.dto';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application)
    private readonly applicationsRepo: Repository<Application>,
    private readonly jobsService: JobsService,
  ) {}

  async create(userId: string, dto: CreateApplicationDto) {
    const existing = await this.applicationsRepo.findOne({
      where: { userId, jobId: dto.jobId },
    });
    if (existing) {
      throw new ConflictException('You already applied to this job');
    }

    await this.jobsService.findById(dto.jobId);
    const application = this.applicationsRepo.create({
      ...dto,
      userId,
      status: ApplicationStatus.SUBMITTED,
      appliedAt: new Date(),
    });
    const saved = await this.applicationsRepo.save(application);
    await this.jobsService.incrementApplications(dto.jobId);
    return saved;
  }

  findByUser(userId: string) {
    return this.applicationsRepo.find({
      where: { userId },
      relations: ['job'],
      order: { appliedAt: 'DESC' },
    });
  }

  findByJob(jobId: string) {
    return this.applicationsRepo.find({
      where: { jobId },
      relations: ['user'],
      order: { appliedAt: 'DESC' },
    });
  }

  async findById(id: string) {
    const app = await this.applicationsRepo.findOne({
      where: { id },
      relations: ['job', 'user'],
    });
    if (!app) throw new NotFoundException('Application not found');
    return app;
  }

  async updateStatus(
    appId: string,
    reviewerId: string,
    dto: UpdateApplicationStatusDto,
  ) {
    const app = await this.findById(appId);
    app.status = dto.status;
    app.feedback = dto.feedback;
    app.reviewedAt = new Date();
    app.reviewedBy = reviewerId;
    return this.applicationsRepo.save(app);
  }

  async withdraw(appId: string, userId: string) {
    const app = await this.findById(appId);
    if (app.userId !== userId) {
      throw new ForbiddenException('Cannot withdraw another user application');
    }
    app.status = ApplicationStatus.DECLINED;
    return this.applicationsRepo.save(app);
  }

  async bulkUpdate(jobId: string, dto: BulkUpdateApplicationsDto) {
    await Promise.all(
      dto.applicationIds.map(async (id) => {
        const app = await this.findById(id);
        if (app.jobId !== jobId) return;
        app.status = dto.status;
        return this.applicationsRepo.save(app);
      }),
    );
    return { updated: dto.applicationIds.length };
  }

  findForReview(_userId: string) {
    return this.applicationsRepo.find({
      where: { status: ApplicationStatus.SUBMITTED },
      relations: ['job', 'user'],
      take: 50,
    });
  }
}
