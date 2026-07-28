import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrganizationMember } from '../../database/entities/organization-member.entity';
import { Subscription } from '../../database/entities/subscription.entity';
import { SubscriptionStatus } from '../../database/entities/enums';
import { REQUIRED_FEATURE_KEY } from '../decorators/plan-feature.decorator';

@Injectable()
export class PlanLimitGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectRepository(Subscription)
    private readonly subRepo: Repository<Subscription>,
    @InjectRepository(OrganizationMember)
    private readonly memberRepo: Repository<OrganizationMember>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const feature = this.reflector.getAllAndOverride<string>(
      REQUIRED_FEATURE_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!feature) return true;

    const request = context.switchToHttp().getRequest();
    const userId = request.user?.id;
    if (!userId) return true;

    const membership = await this.memberRepo.findOne({
      where: { userId, isActive: true },
      relations: ['organization'],
    });
    if (!membership) return true;

    const subscription = await this.subRepo.findOne({
      where: {
        organizationId: membership.organizationId,
        status: SubscriptionStatus.ACTIVE,
      },
      relations: ['plan'],
    });
    if (!subscription?.plan) return true;

    const features = subscription.plan.features;
    const value = features[feature as keyof typeof features];

    if (feature === 'analytics' && !value) {
      throw new ForbiddenException(
        'Analytics requires a Team plan or higher',
      );
    }
    if (feature === 'api_access' && !value) {
      throw new ForbiddenException(
        'API access requires Enterprise plan',
      );
    }
    if (feature === 'bulk_operations' && !value) {
      throw new ForbiddenException(
        'Bulk operations require Business plan or higher',
      );
    }

    request.subscription = subscription;
    request.planFeatures = features;
    return true;
  }
}
