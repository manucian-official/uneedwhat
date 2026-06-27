import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bookmark } from '../../database/entities/bookmark.entity';
import { Job } from '../../database/entities/job.entity';
import { JobsModule } from '../jobs/jobs.module';
import { BookmarksController } from './bookmarks.controller';
import { BookmarksService } from './bookmarks.service';

@Module({
  imports: [TypeOrmModule.forFeature([Bookmark, Job]), JobsModule],
  controllers: [BookmarksController],
  providers: [BookmarksService],
  exports: [BookmarksService],
})
export class BookmarksModule {}
