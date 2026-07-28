import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubscriptionPlan, PlanFeatures } from '../../database/entities/subscription-plan.entity';
import { Subscription } from '../../database/entities/subscription.entity';
import { SubscriptionStatus } from '../../database/entities/enums';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(SubscriptionPlan)
    private readonly plansRepo: Repository<SubscriptionPlan>,
    @InjectRepository(Subscription)
    private readonly subsRepo: Repository<Subscription>,
  ) {}

  async listPlans() {
    return this.plansRepo.find({
      where: { isActive: true },
      order: { sortOrder: 'ASC' },
    });
  }

  async getPlanBySlug(slug: string) {
    const plan = await this.plansRepo.findOne({ where: { slug, isActive: true } });
    if (!plan) throw new NotFoundException('Plan not found');
    return plan;
  }

  async getPlanById(id: string) {
    const plan = await this.plansRepo.findOne({ where: { id } });
    if (!plan) throw new NotFoundException('Plan not found');
    return plan;
  }

  async getOrgSubscription(organizationId: string) {
    return this.subsRepo.findOne({
      where: { organizationId },
      relations: ['plan'],
    });
  }

  async subscribe(organizationId: string, planSlug: string) {
    const plan = await this.getPlanBySlug(planSlug);
    let sub = await this.subsRepo.findOne({ where: { organizationId } });

    if (sub) {
      sub.planId = plan.id;
      sub.status = SubscriptionStatus.ACTIVE;
      sub.currentPeriodStart = new Date();
      sub.currentPeriodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      sub.cancelledAt = undefined;
    } else {
      sub = this.subsRepo.create({
        organizationId,
        planId: plan.id,
        status: SubscriptionStatus.ACTIVE,
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      });
    }

    const saved = await this.subsRepo.save(sub);
    return this.subsRepo.findOne({
      where: { id: saved.id },
      relations: ['plan'],
    });
  }

  async cancel(organizationId: string) {
    const sub = await this.subsRepo.findOne({ where: { organizationId } });
    if (!sub) throw new NotFoundException('Subscription not found');
    sub.status = SubscriptionStatus.CANCELLED;
    sub.cancelledAt = new Date();
    return this.subsRepo.save(sub);
  }

  async updatePlan(
    id: string,
    data: {
      name?: string;
      description?: string;
      priceMonthly?: number;
      priceYearly?: number;
      isActive?: boolean;
      features?: Partial<PlanFeatures>;
    },
  ) {
    const plan = await this.getPlanById(id);
    if (data.features) {
      plan.features = { ...plan.features, ...data.features };
      delete data.features;
    }
    Object.assign(plan, data);
    return this.plansRepo.save(plan);
  }

  async countActive() {
    return this.subsRepo.count({
      where: { status: SubscriptionStatus.ACTIVE },
    });
  }

  async listAll(page = 1, limit = 20) {
    const [items, total] = await this.subsRepo.findAndCount({
      relations: ['plan', 'organization'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { items, total, page, limit };
  }
}
