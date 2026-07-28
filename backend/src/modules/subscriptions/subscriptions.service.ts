import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubscriptionPlan, PlanFeatures } from '../../database/entities/subscription-plan.entity';
import { Subscription } from '../../database/entities/subscription.entity';
import {
  BillingCycle,
  PaymentMethod,
  PaymentStatus,
  SubscriptionStatus,
} from '../../database/entities/enums';
import { PaymentTransaction } from '../../database/entities/payment-transaction.entity';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(SubscriptionPlan)
    private readonly plansRepo: Repository<SubscriptionPlan>,
    @InjectRepository(Subscription)
    private readonly subsRepo: Repository<Subscription>,
    @InjectRepository(PaymentTransaction)
    private readonly paymentsRepo: Repository<PaymentTransaction>,
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

  async subscribe(
    organizationId: string,
    planSlug: string,
    options?: { billingCycle?: BillingCycle },
  ) {
    const plan = await this.getPlanBySlug(planSlug);
    const billingCycle = options?.billingCycle || BillingCycle.MONTHLY;
    let sub = await this.subsRepo.findOne({ where: { organizationId } });

    if (sub) {
      sub.planId = plan.id;
      sub.status = SubscriptionStatus.ACTIVE;
      sub.billingCycle = billingCycle;
      sub.currentPeriodStart = new Date();
      sub.currentPeriodEnd = new Date(
        Date.now() + (billingCycle === BillingCycle.YEARLY ? 365 : 30) * 24 * 60 * 60 * 1000,
      );
      sub.cancelledAt = undefined;
    } else {
      sub = this.subsRepo.create({
        organizationId,
        planId: plan.id,
        status: SubscriptionStatus.ACTIVE,
        billingCycle,
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(
          Date.now() + (billingCycle === BillingCycle.YEARLY ? 365 : 30) * 24 * 60 * 60 * 1000,
        ),
      });
    }

    const saved = await this.subsRepo.save(sub);
    return this.subsRepo.findOne({
      where: { id: saved.id },
      relations: ['plan'],
    });
  }

  private getPriceForCycle(plan: SubscriptionPlan, cycle: BillingCycle) {
    const monthly = Number(plan.priceMonthly) || 0;
    const yearly = Number(plan.priceYearly) || 0;
    if (cycle === BillingCycle.YEARLY) return yearly || monthly * 12;
    return monthly;
  }

  private buildPaymentUrl(method: PaymentMethod, externalRef: string) {
    const encodedRef = encodeURIComponent(externalRef);
    switch (method) {
      case PaymentMethod.MOMO:
        return `https://test-payment.momo.vn/checkout?ref=${encodedRef}`;
      case PaymentMethod.VNPAY:
        return `https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_TxnRef=${encodedRef}`;
      case PaymentMethod.BANK_TRANSFER:
        return `bank://transfer?reference=${encodedRef}`;
      default:
        return `https://checkout.stripe.com/pay/${encodedRef}`;
    }
  }

  async createCheckout(
    organizationId: string,
    input: {
      planSlug: string;
      billingCycle: BillingCycle;
      paymentMethod: PaymentMethod;
    },
  ) {
    const plan = await this.getPlanBySlug(input.planSlug);
    const amount = this.getPriceForCycle(plan, input.billingCycle);

    if (amount <= 0) {
      const subscription = await this.subscribe(organizationId, input.planSlug, {
        billingCycle: input.billingCycle,
      });
      return {
        type: 'free-activation',
        message: 'Free plan activated immediately.',
        subscription,
      };
    }

    const externalRef = `UW-${Date.now().toString(36).toUpperCase()}-${Math.floor(
      Math.random() * 9999,
    )}`;

    const tx = await this.paymentsRepo.save(
      this.paymentsRepo.create({
        organizationId,
        planId: plan.id,
        amount,
        currency: 'USD',
        method: input.paymentMethod,
        billingCycle: input.billingCycle,
        status: PaymentStatus.PENDING,
        externalRef,
        paymentUrl: this.buildPaymentUrl(input.paymentMethod, externalRef),
        metadata: {
          planSlug: plan.slug,
          planName: plan.name,
        },
      }),
    );

    return {
      type: 'payment-required',
      transactionId: tx.id,
      externalRef: tx.externalRef,
      amount: tx.amount,
      currency: tx.currency,
      paymentMethod: tx.method,
      paymentUrl: tx.paymentUrl,
      expiresInMinutes: 30,
    };
  }

  async confirmPayment(organizationId: string, transactionId: string) {
    const tx = await this.paymentsRepo.findOne({
      where: { id: transactionId, organizationId },
      relations: ['plan'],
    });
    if (!tx) throw new NotFoundException('Payment transaction not found');
    if (tx.status === PaymentStatus.PAID) {
      return { message: 'Payment already confirmed', transaction: tx };
    }
    if (tx.status !== PaymentStatus.PENDING) {
      throw new BadRequestException('Transaction is not in pending state');
    }

    tx.status = PaymentStatus.PAID;
    tx.paidAt = new Date();
    await this.paymentsRepo.save(tx);

    const subscription = await this.subscribe(organizationId, tx.plan.slug, {
      billingCycle: tx.billingCycle,
    });
    return { message: 'Payment confirmed', transaction: tx, subscription };
  }

  async getPaymentStatus(organizationId: string, transactionId: string) {
    const tx = await this.paymentsRepo.findOne({
      where: { id: transactionId, organizationId },
      relations: ['plan'],
    });
    if (!tx) throw new NotFoundException('Payment transaction not found');
    return tx;
  }

  async cancelPayment(organizationId: string, transactionId: string, reason?: string) {
    const tx = await this.paymentsRepo.findOne({
      where: { id: transactionId, organizationId },
    });
    if (!tx) throw new NotFoundException('Payment transaction not found');
    if (tx.status === PaymentStatus.PAID) {
      throw new BadRequestException('Paid transaction cannot be cancelled');
    }
    tx.status = PaymentStatus.CANCELLED;
    tx.metadata = { ...(tx.metadata || {}), cancelledReason: reason || 'user_cancelled' };
    return this.paymentsRepo.save(tx);
  }

  async handlePaymentWebhook(input: { externalRef: string; status: string; signature?: string }) {
    const tx = await this.paymentsRepo.findOne({
      where: { externalRef: input.externalRef },
      relations: ['plan'],
    });
    if (!tx) throw new NotFoundException('Payment transaction not found');

    const normalized = input.status.toLowerCase();
    if (normalized === 'paid' || normalized === 'success') {
      tx.status = PaymentStatus.PAID;
      tx.paidAt = new Date();
      await this.paymentsRepo.save(tx);
      const subscription = await this.subscribe(tx.organizationId, tx.plan.slug, {
        billingCycle: tx.billingCycle,
      });
      return { transaction: tx, subscription };
    }

    if (normalized === 'failed') tx.status = PaymentStatus.FAILED;
    else if (normalized === 'expired') tx.status = PaymentStatus.EXPIRED;
    else tx.status = PaymentStatus.CANCELLED;

    await this.paymentsRepo.save(tx);
    return { transaction: tx };
  }

  async listOrgPayments(organizationId: string, page = 1, limit = 20) {
    const [items, total] = await this.paymentsRepo.findAndCount({
      where: { organizationId },
      relations: ['plan'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { items, total, page, limit };
  }

  async listPaymentMethods() {
    return [
      {
        method: PaymentMethod.STRIPE_CARD,
        label: 'Card (Stripe)',
        supports: ['USD', 'VND'],
      },
      { method: PaymentMethod.MOMO, label: 'MoMo Wallet', supports: ['VND'] },
      { method: PaymentMethod.VNPAY, label: 'VNPay Gateway', supports: ['VND'] },
      {
        method: PaymentMethod.BANK_TRANSFER,
        label: 'Bank Transfer',
        supports: ['USD', 'VND'],
      },
    ];
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

  async listPayments(page = 1, limit = 20) {
    const [items, total] = await this.paymentsRepo.findAndCount({
      relations: ['plan', 'organization'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { items, total, page, limit };
  }

  async revenueStats() {
    const payments = await this.paymentsRepo.find({
      where: { status: PaymentStatus.PAID },
      relations: ['plan'],
    });
    const totalRevenue = payments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
    const byMethod = payments.reduce(
      (acc, p) => {
        acc[p.method] = (acc[p.method] || 0) + Number(p.amount || 0);
        return acc;
      },
      {} as Record<string, number>,
    );
    return {
      totalRevenue,
      paidTransactions: payments.length,
      byMethod,
    };
  }
}
