import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApplicationStatus, UserRole } from '../../database/entities/enums';
import { ActivityLog } from '../../database/entities/activity-log.entity';
import { Application } from '../../database/entities/application.entity';
import { Job } from '../../database/entities/job.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(ActivityLog)
    private readonly activityRepo: Repository<ActivityLog>,
    @InjectRepository(Application)
    private readonly applicationsRepo: Repository<Application>,
    @InjectRepository(Job)
    private readonly jobsRepo: Repository<Job>,
  ) {}

  trackActivity(
    userId: string,
    action: string,
    entityType: string,
    entityId: string,
    metadata?: Record<string, unknown>,
  ) {
    const log = this.activityRepo.create({
      userId,
      action,
      entityType,
      entityId,
      metadata,
    });
    return this.activityRepo.save(log);
  }

  async getDashboard(userId: string, role: UserRole) {
    if (
      role === UserRole.HR_PROFESSIONAL ||
      role === UserRole.RECRUITER ||
      role === UserRole.ADMIN
    ) {
      return this.getHRDashboard(userId);
    }
    return this.getJobSeekerDashboard(userId);
  }

  async getJobSeekerDashboard(userId: string) {
    const applications = await this.applicationsRepo.find({ where: { userId } });
    const byStatus = Object.values(ApplicationStatus).reduce(
      (acc, status) => {
        acc[status] = applications.filter((a) => a.status === status).length;
        return acc;
      },
      {} as Record<string, number>,
    );

    return {
      totalApplications: applications.length,
      byStatus,
      recentApplications: applications.slice(0, 5),
    };
  }

  async getHRDashboard(userId: string) {
    const jobs = await this.jobsRepo.find({ where: { postedByUserId: userId } });
    const jobIds = jobs.map((j) => j.id);
    const applications = jobIds.length
      ? await this.applicationsRepo
          .createQueryBuilder('app')
          .where('app.jobId IN (:...jobIds)', { jobIds })
          .getMany()
      : [];

    return {
      totalJobs: jobs.length,
      activeJobs: jobs.filter((j) => j.status === 'active').length,
      totalApplications: applications.length,
      pipeline: {
        submitted: applications.filter((a) => a.status === ApplicationStatus.SUBMITTED).length,
        screening: applications.filter((a) => a.status === ApplicationStatus.SCREENING).length,
        interview: applications.filter((a) => a.status === ApplicationStatus.INTERVIEW).length,
        offer: applications.filter((a) => a.status === ApplicationStatus.OFFER).length,
      },
      topJobs: jobs
        .sort((a, b) => b.applicationsCount - a.applicationsCount)
        .slice(0, 5)
        .map((j) => ({
          id: j.id,
          title: j.title,
          applicationsCount: j.applicationsCount,
          viewsCount: j.viewsCount,
        })),
    };
  }

  async getJobMetrics(jobId: string) {
    const job = await this.jobsRepo.findOne({ where: { id: jobId } });
    if (!job) return null;
    const applications = await this.applicationsRepo.find({ where: { jobId } });
    return {
      jobId,
      viewsCount: job.viewsCount,
      applicationsCount: job.applicationsCount,
      statusBreakdown: Object.values(ApplicationStatus).reduce(
        (acc, status) => {
          acc[status] = applications.filter((a) => a.status === status).length;
          return acc;
        },
        {} as Record<string, number>,
      ),
    };
  }
}
