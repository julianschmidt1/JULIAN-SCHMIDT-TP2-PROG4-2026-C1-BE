import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';

import { AdminGuard } from '../auth/guards/admin.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { StatisticsDateRangeQueryDto } from './dto/statistics-date-range-query.dto';
import { PostsService } from './posts.service';

@ApiTags('posts-statistics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('posts/statistics')
export class PostsStatisticsController {
  constructor(private readonly postsService: PostsService) {}

  @Get('posts-by-user')
  @ApiQuery({ name: 'from', required: false, example: '2026-07-01' })
  @ApiQuery({ name: 'to', required: false, example: '2026-07-31' })
  getPostsByUser(@Query() query: StatisticsDateRangeQueryDto) {
    return this.postsService.getPostsByUserStatistics(query.from, query.to);
  }

  @Get('comments-over-time')
  @ApiQuery({ name: 'from', required: false, example: '2026-07-01' })
  @ApiQuery({ name: 'to', required: false, example: '2026-07-31' })
  getCommentsOverTime(@Query() query: StatisticsDateRangeQueryDto) {
    return this.postsService.getCommentsOverTimeStatistics(
      query.from,
      query.to,
    );
  }

  @Get('comments-by-post')
  @ApiQuery({ name: 'from', required: false, example: '2026-07-01' })
  @ApiQuery({ name: 'to', required: false, example: '2026-07-31' })
  getCommentsByPost(@Query() query: StatisticsDateRangeQueryDto) {
    return this.postsService.getCommentsByPostStatistics(query.from, query.to);
  }
}
