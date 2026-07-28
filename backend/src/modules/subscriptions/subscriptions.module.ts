import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentTransaction } from '../../database/entities/payment-transaction.entity';
import { SubscriptionPlan } from '../../database/entities/subscription-plan.entity';
import { Subscription } from '../../database/entities/subscription.entity';
import { OrganizationsModule } from '../organizations/organizations.module';
import { SubscriptionsController } from './subscriptions.controller';
import { SubscriptionsService } from './subscriptions.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([SubscriptionPlan, Subscription, PaymentTransaction]),
    forwardRef(() => OrganizationsModule),
  ],
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService],
  exports: [SubscriptionsService],
})
export class SubscriptionsModule {}
