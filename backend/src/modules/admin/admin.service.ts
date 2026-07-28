import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job } from '../../database/entities/job.entity';
import { Application } from '../../database/entities/application.entity';
import { OrganizationsService } from '../organizations/organizations.service';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class AdminService {
  constructor(
    private readonly usersService: UsersService,
    private readonly orgsService: OrganizationsService,
    private readonly subsService: SubscriptionsService,
    @InjectRepository(Job) private readonly jobsRepo: Repository<Job>,
    @InjectRepository(Application)
    private readonly appsRepo: Repository<Application>,
  ) {}

  async getDashboardStats() {
    const [users, organizations, activeSubscriptions, jobs, applications] =
      await Promise.all([
        this.usersService.countAll(),
        this.orgsService.countAll(),
        this.subsService.countActive(),
        this.jobsRepo.count(),
        this.appsRepo.count(),
      ]);

    const plans = await this.subsService.listPlans();

    return {
      users,
      organizations,
      activeSubscriptions,
      jobs,
      applications,
      plans: plans.map((p) => ({
        id: p.id,
        name: p.name,
        tier: p.tier,
        priceMonthly: p.priceMonthly,
      })),
    };
  }
}
