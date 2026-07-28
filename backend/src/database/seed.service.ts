import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { PlanTier, UserRole } from '../database/entities/enums';
import { SubscriptionPlan, PlanFeatures } from '../database/entities/subscription-plan.entity';
import { User } from '../database/entities/user.entity';

const DEFAULT_PLANS: Array<{
  slug: string;
  name: string;
  tier: PlanTier;
  description: string;
  priceMonthly: number;
  priceYearly: number;
  sortOrder: number;
  features: PlanFeatures;
}> = [
  {
    slug: 'free',
    name: 'Free',
    tier: PlanTier.FREE,
    description: 'Essential hiring tools for individuals and small teams getting started.',
    priceMonthly: 0,
    priceYearly: 0,
    sortOrder: 0,
    features: {
      max_jobs: 2,
      max_applications: 50,
      team_seats: 1,
      analytics: false,
      api_access: false,
      bulk_operations: false,
      custom_branding: false,
      priority_support: false,
      collaboration: false,
    },
  },
  {
    slug: 'team',
    name: 'Team',
    tier: PlanTier.TEAM,
    description: 'Collaborative hiring for growing teams with shared pipelines.',
    priceMonthly: 29,
    priceYearly: 290,
    sortOrder: 1,
    features: {
      max_jobs: 10,
      max_applications: 500,
      team_seats: 5,
      analytics: 'basic',
      api_access: false,
      bulk_operations: false,
      custom_branding: false,
      priority_support: false,
      collaboration: true,
    },
  },
  {
    slug: 'business',
    name: 'Business',
    tier: PlanTier.BUSINESS,
    description: 'Advanced analytics and bulk operations for mid-size companies.',
    priceMonthly: 99,
    priceYearly: 990,
    sortOrder: 2,
    features: {
      max_jobs: 50,
      max_applications: 5000,
      team_seats: 25,
      analytics: 'advanced',
      api_access: false,
      bulk_operations: true,
      custom_branding: false,
      priority_support: true,
      collaboration: true,
    },
  },
  {
    slug: 'enterprise',
    name: 'Enterprise VIP',
    tier: PlanTier.ENTERPRISE,
    description: 'Unlimited scale, API access, custom branding, and priority support.',
    priceMonthly: 299,
    priceYearly: 2990,
    sortOrder: 3,
    features: {
      max_jobs: -1,
      max_applications: -1,
      team_seats: -1,
      analytics: 'full',
      api_access: true,
      bulk_operations: true,
      custom_branding: true,
      priority_support: true,
      collaboration: true,
    },
  },
];

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectRepository(SubscriptionPlan)
    private readonly plansRepo: Repository<SubscriptionPlan>,
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
    private readonly config: ConfigService,
  ) {}

  async onModuleInit() {
    if (!this.config.get<boolean>('app.seedOnStartup')) return;
    await this.seedPlans();
    await this.seedAdmin();
  }

  async seedPlans() {
    for (const plan of DEFAULT_PLANS) {
      const existing = await this.plansRepo.findOne({ where: { slug: plan.slug } });
      if (!existing) {
        await this.plansRepo.save(this.plansRepo.create(plan));
      }
    }
  }

  async seedAdmin() {
    const email = this.config.get<string>('app.defaultAdminEmail')!;
    const existing = await this.usersRepo.findOne({ where: { email } });
    if (existing) return;

    const password = this.config.get<string>('app.defaultAdminPassword')!;
    const passwordHash = await bcrypt.hash(password, 12);
    await this.usersRepo.save(
      this.usersRepo.create({
        email,
        passwordHash,
        firstName: 'System',
        lastName: 'Admin',
        role: UserRole.ADMIN,
        isVerified: true,
        isActive: true,
      }),
    );
    console.log(`[Seed] Default admin created: ${email}`);
  }
}
