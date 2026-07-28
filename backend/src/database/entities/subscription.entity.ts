import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BillingCycle, SubscriptionStatus } from './enums';
import { Organization } from './organization.entity';
import { SubscriptionPlan } from './subscription-plan.entity';

@Entity('subscriptions')
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  organizationId: string;

  @Column()
  planId: string;

  @Column({ type: 'varchar', default: SubscriptionStatus.ACTIVE })
  status: SubscriptionStatus;

  @Column({ type: 'varchar', default: BillingCycle.MONTHLY })
  billingCycle: BillingCycle;

  @Column({ type: 'datetime', nullable: true })
  trialEndsAt?: Date;

  @Column({ type: 'datetime', nullable: true })
  currentPeriodStart?: Date;

  @Column({ type: 'datetime', nullable: true })
  currentPeriodEnd?: Date;

  @Column({ type: 'datetime', nullable: true })
  cancelledAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => Organization, (org) => org.subscription, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'organizationId' })
  organization: Organization;

  @ManyToOne(() => SubscriptionPlan, (plan) => plan.subscriptions)
  @JoinColumn({ name: 'planId' })
  plan: SubscriptionPlan;
}
