import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard, RolesGuard } from '../../common/guards/jwt-auth.guard';
import { UserRole } from '../../database/entities/enums';
import { UpdateHRProfileDto, UpdateJobSeekerProfileDto } from './dto/profile.dto';
import { ProfilesService } from './profiles.service';

@ApiTags('profiles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get('job-seeker/:userId')
  getJobSeeker(@Param('userId') userId: string) {
    return this.profilesService.getJobSeekerProfile(userId);
  }

  @Roles(UserRole.JOB_SEEKER)
  @Patch('job-seeker')
  updateJobSeeker(
    @Body() dto: UpdateJobSeekerProfileDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.profilesService.updateJobSeekerProfile(user.id, dto);
  }

  @Get('hr/:userId')
  getHR(@Param('userId') userId: string) {
    return this.profilesService.getHRProfile(userId);
  }

  @Roles(UserRole.HR_PROFESSIONAL, UserRole.RECRUITER, UserRole.ADMIN)
  @Patch('hr')
  updateHR(
    @Body() dto: UpdateHRProfileDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.profilesService.updateHRProfile(user.id, dto);
  }

  @Roles(UserRole.JOB_SEEKER)
  @Post('resume')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (_req, file, cb) => {
          const unique = `${Date.now()}${extname(file.originalname)}`;
          cb(null, unique);
        },
      }),
    }),
  )
  uploadResume(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: { id: string },
  ) {
    return this.profilesService.uploadResume(user.id, file);
  }
}
