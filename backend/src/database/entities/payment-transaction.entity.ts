import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BillingCycle, PaymentMethod, PaymentStatus } from './enums';
import { Organization } from './organization.entity';
import { SubscriptionPlan } from './subscription-plan.entity';

@Entity('payment_transactions')
export class PaymentTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  organizationId: string;

  @Column()
  planId: string;

  @Column({ type: 'varchar' })
  method: PaymentMethod;

  @Column({ type: 'varchar', default: PaymentStatus.PENDING })
  status: PaymentStatus;

  @Column({ type: 'varchar', default: BillingCycle.MONTHLY })
  billingCycle: BillingCycle;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ nullable: true })
  currency?: string;

  @Column({ nullable: true })
  externalRef?: string;

  @Column({ type: 'text', nullable: true })
  paymentUrl?: string;

  @Column({ type: 'simple-json', nullable: true })
  metadata?: Record<string, unknown>;

  @Column({ type: 'datetime', nullable: true })
  paidAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Organization, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'organizationId' })
  organization: Organization;

  @ManyToOne(() => SubscriptionPlan)
  @JoinColumn({ name: 'planId' })
  plan: SubscriptionPlan;
}
