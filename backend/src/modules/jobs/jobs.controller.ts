import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public, Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard, RolesGuard } from '../../common/guards/jwt-auth.guard';
import { UserRole } from '../../database/entities/enums';
import { UsersService } from '../users/users.service';
import { CreateJobDto, JobFilterDto, UpdateJobDto } from './dto/job.dto';
import { JobsService } from './jobs.service';

@ApiTags('jobs')
@Controller('jobs')
export class JobsController {
  constructor(
    private readonly jobsService: JobsService,
    private readonly usersService: UsersService,
  ) {}

  @Public()
  @Get()
  list(@Query() filter: JobFilterDto) {
    return this.jobsService.findAll(filter);
  }

  @Public()
  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.jobsService.findById(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.HR_PROFESSIONAL, UserRole.RECRUITER, UserRole.ADMIN)
  @Post()
  async create(
    @Body() dto: CreateJobDto,
    @CurrentUser() user: { id: string },
  ) {
    const hrProfile = await this.usersService.findById(user.id);
    const companyName = dto['companyName'] as string | undefined;
    return this.jobsService.create(
      user.id,
      companyName || `${hrProfile?.firstName}'s Company`,
      dto,
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.HR_PROFESSIONAL, UserRole.RECRUITER, UserRole.ADMIN)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateJobDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.jobsService.update(id, user.id, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.HR_PROFESSIONAL, UserRole.RECRUITER, UserRole.ADMIN)
  @Post(':id/close')
  close(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    return this.jobsService.close(id, user.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.HR_PROFESSIONAL, UserRole.RECRUITER, UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    return this.jobsService.remove(id, user.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.HR_PROFESSIONAL, UserRole.RECRUITER, UserRole.ADMIN)
  @Get(':id/analytics')
  analytics(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    return this.jobsService.getAnalytics(id, user.id);
  }
}
