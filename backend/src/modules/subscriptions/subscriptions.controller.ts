import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/roles.decorator';
import { OrganizationsService } from '../organizations/organizations.service';
import {
  CancelPaymentDto,
  CheckoutSubscriptionDto,
  ConfirmPaymentDto,
  PaymentWebhookDto,
  SubscribeDto,
} from './dto/subscription.dto';
import { SubscriptionsService } from './subscriptions.service';

@ApiTags('subscriptions')
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(
    private readonly subsService: SubscriptionsService,
    private readonly orgsService: OrganizationsService,
  ) {}

  @Public()
  @Get('plans')
  listPlans() {
    return this.subsService.listPlans();
  }

  @Public()
  @Get('plans/:slug')
  getPlan(@Param('slug') slug: string) {
    return this.subsService.getPlanBySlug(slug);
  }

  @Public()
  @Get('payment-methods')
  paymentMethods() {
    return this.subsService.listPaymentMethods();
  }

  @ApiBearerAuth()
  @Get('me')
  async mySubscription(@CurrentUser() user: { id: string }) {
    const org = await this.orgsService.getUserOrganization(user.id);
    if (!org) return { subscription: null };
    const subscription = await this.subsService.getOrgSubscription(org.id);
    return { organization: org, subscription };
  }

  @ApiBearerAuth()
  @Post('subscribe')
  async subscribe(
    @CurrentUser() user: { id: string },
    @Body() dto: SubscribeDto,
  ) {
    const org = await this.orgsService.getOrCreateForUser(user.id, dto.orgName);
    return this.subsService.subscribe(org.id, dto.planSlug);
  }

  @ApiBearerAuth()
  @Post('cancel')
  async cancel(@CurrentUser() user: { id: string }) {
    const org = await this.orgsService.getUserOrganization(user.id);
    if (!org) return { message: 'No organization found' };
    return this.subsService.cancel(org.id);
  }

  @ApiBearerAuth()
  @Post('checkout')
  async checkout(
    @CurrentUser() user: { id: string },
    @Body() dto: CheckoutSubscriptionDto,
  ) {
    const org = await this.orgsService.getOrCreateForUser(user.id, dto.orgName);
    return this.subsService.createCheckout(org.id, dto);
  }

  @ApiBearerAuth()
  @Post('payments/confirm')
  async confirmPayment(
    @CurrentUser() user: { id: string },
    @Body() dto: ConfirmPaymentDto,
  ) {
    const org = await this.orgsService.getUserOrganization(user.id);
    if (!org) return { message: 'No organization found' };
    return this.subsService.confirmPayment(org.id, dto.transactionId);
  }

  @ApiBearerAuth()
  @Get('payments/:transactionId')
  async paymentStatus(
    @CurrentUser() user: { id: string },
    @Param('transactionId') transactionId: string,
  ) {
    const org = await this.orgsService.getUserOrganization(user.id);
    if (!org) return { message: 'No organization found' };
    return this.subsService.getPaymentStatus(org.id, transactionId);
  }

  @ApiBearerAuth()
  @Post('payments/cancel')
  async cancelPayment(
    @CurrentUser() user: { id: string },
    @Body() dto: CancelPaymentDto,
  ) {
    const org = await this.orgsService.getUserOrganization(user.id);
    if (!org) return { message: 'No organization found' };
    return this.subsService.cancelPayment(org.id, dto.transactionId, dto.reason);
  }

  @Public()
  @Post('payments/webhook')
  async paymentWebhook(@Body() dto: PaymentWebhookDto) {
    return this.subsService.handlePaymentWebhook(dto);
  }

  @ApiBearerAuth()
  @Get('payments/me')
  async myPayments(
    @CurrentUser() user: { id: string },
    @Query('page') page = '1',
    @Query('limit') limit = '20',
  ) {
    const org = await this.orgsService.getUserOrganization(user.id);
    if (!org) return { items: [], total: 0, page: +page, limit: +limit };
    return this.subsService.listOrgPayments(org.id, +page, +limit);
  }
}
