import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InterviewStatus } from '../../database/entities/enums';
import { Interview } from '../../database/entities/interview.entity';
import { ApplicationsService } from '../applications/applications.service';
import {
  InterviewFeedbackDto,
  ScheduleInterviewDto,
  UpdateInterviewStatusDto,
} from './dto/interview.dto';

@Injectable()
export class InterviewsService {
  constructor(
    @InjectRepository(Interview)
    private readonly interviewsRepo: Repository<Interview>,
    private readonly applicationsService: ApplicationsService,
  ) {}

  async schedule(scheduledBy: string, dto: ScheduleInterviewDto) {
    await this.applicationsService.findById(dto.applicationId);
    const interview = this.interviewsRepo.create({
      ...dto,
      scheduledBy,
      duration: dto.duration ?? 60,
      status: InterviewStatus.SCHEDULED,
      feedbacks: [],
    });
    return this.interviewsRepo.save(interview);
  }

  findUpcoming(userId: string) {
    return this.interviewsRepo
      .createQueryBuilder('interview')
      .where('interview.scheduledBy = :userId', { userId })
      .orWhere("interview.interviewerIds LIKE :pattern", { pattern: `%${userId}%` })
      .andWhere('interview.date >= :now', { now: new Date() })
      .orderBy('interview.date', 'ASC')
      .getMany();
  }

  async findById(id: string) {
    const interview = await this.interviewsRepo.findOne({
      where: { id },
      relations: ['application'],
    });
    if (!interview) throw new NotFoundException('Interview not found');
    return interview;
  }

  async updateStatus(id: string, dto: UpdateInterviewStatusDto) {
    const interview = await this.findById(id);
    interview.status = dto.status;
    return this.interviewsRepo.save(interview);
  }

  async submitFeedback(
    interviewId: string,
    userId: string,
    dto: InterviewFeedbackDto,
  ) {
    const interview = await this.findById(interviewId);
    interview.feedbacks = [
      ...interview.feedbacks,
      {
        interviewerId: userId,
        rating: dto.rating,
        notes: dto.notes,
        submittedAt: new Date(),
      },
    ];
    return this.interviewsRepo.save(interview);
  }

  async cancel(id: string, _reason?: string) {
    const interview = await this.findById(id);
    interview.status = InterviewStatus.CANCELLED;
    return this.interviewsRepo.save(interview);
  }
}
