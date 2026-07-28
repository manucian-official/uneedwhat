import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrgMemberRole, PlanTier } from '../../database/entities/enums';
import { Organization } from '../../database/entities/organization.entity';
import { OrganizationMember } from '../../database/entities/organization-member.entity';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(Organization)
    private readonly orgRepo: Repository<Organization>,
    @InjectRepository(OrganizationMember)
    private readonly memberRepo: Repository<OrganizationMember>,
    @Inject(forwardRef(() => SubscriptionsService))
    private readonly subsService: SubscriptionsService,
  ) {}

  async getUserOrganization(userId: string) {
    const membership = await this.memberRepo.findOne({
      where: { userId, isActive: true },
      relations: ['organization'],
    });
    return membership?.organization || null;
  }

  async getOrCreateForUser(userId: string, orgName?: string) {
    const existing = await this.getUserOrganization(userId);
    if (existing) return existing;

    const org = await this.orgRepo.save(
      this.orgRepo.create({
        name: orgName || 'My Organization',
        slug: `org-${userId.slice(0, 8)}`,
      }),
    );

    await this.memberRepo.save(
      this.memberRepo.create({
        organizationId: org.id,
        userId,
        role: OrgMemberRole.OWNER,
      }),
    );

    await this.subsService.subscribe(org.id, PlanTier.FREE);
    return org;
  }

  async findAll(page = 1, limit = 20) {
    const [items, total] = await this.orgRepo.findAndCount({
      relations: ['subscription', 'subscription.plan', 'members'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { items, total, page, limit };
  }

  async findOne(id: string) {
    const org = await this.orgRepo.findOne({
      where: { id },
      relations: ['subscription', 'subscription.plan', 'members', 'members.user'],
    });
    if (!org) throw new NotFoundException('Organization not found');
    return org;
  }

  async addMember(orgId: string, userId: string, role: OrgMemberRole) {
    const existing = await this.memberRepo.findOne({
      where: { organizationId: orgId, userId },
    });
    if (existing) {
      throw new ConflictException('User is already a member');
    }
    return this.memberRepo.save(
      this.memberRepo.create({ organizationId: orgId, userId, role }),
    );
  }

  async suspend(id: string) {
    await this.orgRepo.update(id, { isActive: false });
    return this.findOne(id);
  }

  async countAll() {
    return this.orgRepo.count();
  }
}
