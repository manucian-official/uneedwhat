import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { UserRole } from '../../database/entities/enums';
import { AnalyticsService } from './analytics.service';

@ApiTags('analytics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  dashboard(@CurrentUser() user: { id: string; role: UserRole }) {
    return this.analyticsService.getDashboard(user.id, user.role);
  }

  @Get('job/:jobId')
  jobMetrics(@Param('jobId') jobId: string) {
    return this.analyticsService.getJobMetrics(jobId);
  }
}
