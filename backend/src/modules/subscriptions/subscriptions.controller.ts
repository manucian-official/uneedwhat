import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/roles.decorator';
import { OrganizationsService } from '../organizations/organizations.service';
import { SubscribeDto } from './dto/subscription.dto';
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
}
