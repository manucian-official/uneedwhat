import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard, RolesGuard } from '../../common/guards/jwt-auth.guard';
import { UserRole } from '../../database/entities/enums';
import { ApplicationsService } from './applications.service';
import {
  BulkUpdateApplicationsDto,
  CreateApplicationDto,
  UpdateApplicationStatusDto,
} from './dto/application.dto';

@ApiTags('applications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Roles(UserRole.JOB_SEEKER)
  @Post()
  create(
    @Body() dto: CreateApplicationDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.applicationsService.create(user.id, dto);
  }

  @Get()
  listMine(@CurrentUser() user: { id: string }) {
    return this.applicationsService.findByUser(user.id);
  }

  @Get('review')
  @Roles(UserRole.HR_PROFESSIONAL, UserRole.RECRUITER, UserRole.ADMIN)
  forReview(@CurrentUser() user: { id: string }) {
    return this.applicationsService.findForReview(user.id);
  }

  @Get('job/:jobId')
  @Roles(UserRole.HR_PROFESSIONAL, UserRole.RECRUITER, UserRole.ADMIN)
  byJob(@Param('jobId') jobId: string) {
    return this.applicationsService.findByJob(jobId);
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.applicationsService.findById(id);
  }

  @Patch(':id/status')
  @Roles(UserRole.HR_PROFESSIONAL, UserRole.RECRUITER, UserRole.ADMIN)
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateApplicationStatusDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.applicationsService.updateStatus(id, user.id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.JOB_SEEKER)
  withdraw(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    return this.applicationsService.withdraw(id, user.id);
  }

  @Post('bulk-update/:jobId')
  @Roles(UserRole.HR_PROFESSIONAL, UserRole.RECRUITER, UserRole.ADMIN)
  bulkUpdate(
    @Param('jobId') jobId: string,
    @Body() dto: BulkUpdateApplicationsDto,
  ) {
    return this.applicationsService.bulkUpdate(jobId, dto);
  }
}
