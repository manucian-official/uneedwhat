import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Request } from 'express';
import { Roles } from '../../common/decorators/roles.decorator';
import { AuditLogService } from '../../common/services/audit-log.service';
import { getClientIp } from '../../common/middleware/ip-firewall.middleware';
import { UserRole } from '../../database/entities/enums';
import { OrganizationsService } from '../organizations/organizations.service';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { UsersService } from '../users/users.service';
import { UpdatePlanDto } from './dto/admin.dto';
import { AdminService } from './admin.service';

@ApiTags('admin')
@ApiBearerAuth()
@Roles(UserRole.ADMIN)
@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly usersService: UsersService,
    private readonly orgsService: OrganizationsService,
    private readonly subsService: SubscriptionsService,
    private readonly auditLog: AuditLogService,
  ) {}

  @Get('dashboard')
  getDashboard() {
    return this.adminService.getDashboardStats();
  }

  @Get('users')
  listUsers(@Query('page') page = '1', @Query('limit') limit = '20') {
    return this.usersService.findAll(+page, +limit);
  }

  @Patch('users/:id/suspend')
  async suspendUser(@Param('id') id: string, @Req() req: Request) {
    const result = await this.usersService.suspend(id);
    await this.auditLog.log({
      adminId: (req as any).user.id,
      action: 'user.suspend',
      resourceType: 'user',
      resourceId: id,
      ipAddress: getClientIp(req),
      userAgent: req.headers['user-agent'],
    });
    return result;
  }

  @Patch('users/:id/activate')
  async activateUser(@Param('id') id: string, @Req() req: Request) {
    const result = await this.usersService.activate(id);
    await this.auditLog.log({
      adminId: (req as any).user.id,
      action: 'user.activate',
      resourceType: 'user',
      resourceId: id,
      ipAddress: getClientIp(req),
      userAgent: req.headers['user-agent'],
    });
    return result;
  }

  @Get('organizations')
  listOrgs(@Query('page') page = '1', @Query('limit') limit = '20') {
    return this.orgsService.findAll(+page, +limit);
  }

  @Patch('organizations/:id/suspend')
  async suspendOrg(@Param('id') id: string, @Req() req: Request) {
    const result = await this.orgsService.suspend(id);
    await this.auditLog.log({
      adminId: (req as any).user.id,
      action: 'organization.suspend',
      resourceType: 'organization',
      resourceId: id,
      ipAddress: getClientIp(req),
      userAgent: req.headers['user-agent'],
    });
    return result;
  }

  @Get('subscriptions')
  listSubscriptions(@Query('page') page = '1', @Query('limit') limit = '20') {
    return this.subsService.listAll(+page, +limit);
  }

  @Get('payments')
  listPayments(@Query('page') page = '1', @Query('limit') limit = '20') {
    return this.subsService.listPayments(+page, +limit);
  }

  @Get('revenue')
  revenue() {
    return this.subsService.revenueStats();
  }

  @Get('plans')
  listPlans() {
    return this.subsService.listPlans();
  }

  @Patch('plans/:id')
  async updatePlan(
    @Param('id') id: string,
    @Body() dto: UpdatePlanDto,
    @Req() req: Request,
  ) {
    const result = await this.subsService.updatePlan(id, dto);
    await this.auditLog.log({
      adminId: (req as any).user.id,
      action: 'plan.update',
      resourceType: 'subscription_plan',
      resourceId: id,
      metadata: dto as Record<string, unknown>,
      ipAddress: getClientIp(req),
      userAgent: req.headers['user-agent'],
    });
    return result;
  }

  @Get('audit-logs')
  getAuditLogs(@Query('limit') limit = '50') {
    return this.auditLog.findRecent(+limit);
  }
}
