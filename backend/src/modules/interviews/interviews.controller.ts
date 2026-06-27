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
import {
  InterviewFeedbackDto,
  ScheduleInterviewDto,
  UpdateInterviewStatusDto,
} from './dto/interview.dto';
import { InterviewsService } from './interviews.service';

@ApiTags('interviews')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('interviews')
export class InterviewsController {
  constructor(private readonly interviewsService: InterviewsService) {}

  @Roles(UserRole.HR_PROFESSIONAL, UserRole.RECRUITER, UserRole.ADMIN)
  @Post()
  schedule(
    @Body() dto: ScheduleInterviewDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.interviewsService.schedule(user.id, dto);
  }

  @Get()
  upcoming(@CurrentUser() user: { id: string }) {
    return this.interviewsService.findUpcoming(user.id);
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.interviewsService.findById(id);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateInterviewStatusDto) {
    return this.interviewsService.updateStatus(id, dto);
  }

  @Post(':id/feedback')
  feedback(
    @Param('id') id: string,
    @Body() dto: InterviewFeedbackDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.interviewsService.submitFeedback(id, user.id, dto);
  }

  @Delete(':id')
  cancel(@Param('id') id: string) {
    return this.interviewsService.cancel(id);
  }
}
