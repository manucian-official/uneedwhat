import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HRProfile } from '../../database/entities/hr-profile.entity';
import { JobSeekerProfile } from '../../database/entities/job-seeker-profile.entity';
import { UpdateHRProfileDto, UpdateJobSeekerProfileDto } from './dto/profile.dto';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(HRProfile)
    private readonly hrRepo: Repository<HRProfile>,
    @InjectRepository(JobSeekerProfile)
    private readonly seekerRepo: Repository<JobSeekerProfile>,
  ) {}

  async getJobSeekerProfile(userId: string) {
    const profile = await this.seekerRepo.findOne({ where: { userId } });
    if (!profile) throw new NotFoundException('Job seeker profile not found');
    return profile;
  }

  async updateJobSeekerProfile(userId: string, dto: UpdateJobSeekerProfileDto) {
    const profile = await this.getJobSeekerProfile(userId);
    Object.assign(profile, dto);
    return this.seekerRepo.save(profile);
  }

  async getHRProfile(userId: string) {
    const profile = await this.hrRepo.findOne({ where: { userId } });
    if (!profile) throw new NotFoundException('HR profile not found');
    return profile;
  }

  async updateHRProfile(userId: string, dto: UpdateHRProfileDto) {
    const profile = await this.getHRProfile(userId);
    Object.assign(profile, dto);
    return this.hrRepo.save(profile);
  }

  async uploadResume(userId: string, file: Express.Multer.File) {
    const profile = await this.getJobSeekerProfile(userId);
    profile.resume = {
      url: `/uploads/${file.filename}`,
      fileName: file.originalname,
      uploadedAt: new Date(),
    };
    return this.seekerRepo.save(profile);
  }
}
