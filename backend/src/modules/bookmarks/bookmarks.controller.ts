import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { BookmarksService } from './bookmarks.service';

@ApiTags('bookmarks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('bookmarks')
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @Get()
  list(@CurrentUser() user: { id: string }) {
    return this.bookmarksService.list(user.id);
  }

  @Post('jobs/:jobId')
  add(@Param('jobId') jobId: string, @CurrentUser() user: { id: string }) {
    return this.bookmarksService.bookmark(user.id, jobId);
  }

  @Delete('jobs/:jobId')
  remove(@Param('jobId') jobId: string, @CurrentUser() user: { id: string }) {
    return this.bookmarksService.unbookmark(user.id, jobId);
  }

  @Get('jobs/:jobId/status')
  status(@Param('jobId') jobId: string, @CurrentUser() user: { id: string }) {
    return this.bookmarksService.isBookmarked(user.id, jobId);
  }
}
