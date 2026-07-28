import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PlanTier } from './enums';
import { Subscription } from './subscription.entity';

export interface PlanFeatures {
  max_jobs: number;
  max_applications: number;
  team_seats: number;
  analytics: boolean | 'basic' | 'advanced' | 'full';
  api_access: boolean;
  bulk_operations: boolean;
  custom_branding: boolean;
  priority_support: boolean;
  collaboration: boolean;
}

@Entity('subscription_plans')
export class SubscriptionPlan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  slug: string;

  @Column()
  name: string;

  @Column({ type: 'varchar' })
  tier: PlanTier;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  priceMonthly: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  priceYearly?: number;

  @Column('simple-json')
  features: PlanFeatures;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: 0 })
  sortOrder: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Subscription, (sub) => sub.plan)
  subscriptions?: Subscription[];
}
