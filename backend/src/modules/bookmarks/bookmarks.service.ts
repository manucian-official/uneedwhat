import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bookmark } from '../../database/entities/bookmark.entity';
import { Job } from '../../database/entities/job.entity';
import { JobsService } from '../jobs/jobs.service';

@Injectable()
export class BookmarksService {
  constructor(
    @InjectRepository(Bookmark)
    private readonly bookmarksRepo: Repository<Bookmark>,
    @InjectRepository(Job)
    private readonly jobsRepo: Repository<Job>,
    private readonly jobsService: JobsService,
  ) {}

  async bookmark(userId: string, jobId: string) {
    const existing = await this.bookmarksRepo.findOne({ where: { userId, jobId } });
    if (existing) throw new ConflictException('Job already bookmarked');
    await this.jobsService.findById(jobId);
    const bookmark = this.bookmarksRepo.create({ userId, jobId });
    return this.bookmarksRepo.save(bookmark);
  }

  async unbookmark(userId: string, jobId: string) {
    const bookmark = await this.bookmarksRepo.findOne({ where: { userId, jobId } });
    if (!bookmark) throw new NotFoundException('Bookmark not found');
    await this.bookmarksRepo.remove(bookmark);
    return { message: 'Bookmark removed' };
  }

  async list(userId: string) {
    const bookmarks = await this.bookmarksRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
    const jobIds = bookmarks.map((b) => b.jobId);
    if (!jobIds.length) return [];
    return this.jobsRepo
      .createQueryBuilder('job')
      .whereInIds(jobIds)
      .getMany();
  }

  async isBookmarked(userId: string, jobId: string) {
    const bookmark = await this.bookmarksRepo.findOne({ where: { userId, jobId } });
    return { bookmarked: !!bookmark };
  }
}
