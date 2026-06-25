import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthenticatedRequest } from '../auth/interfaces/authenticated-request.interface';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { GetCommentsQueryDto } from './dto/get-comments-query.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@ApiTags('comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get('posts/:postId')
  findByPost(
    @Param('postId') postId: string,
    @Query() query: GetCommentsQueryDto,
  ) {
    return this.commentsService.findByPost(postId, query);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('posts/:postId')
  @HttpCode(HttpStatus.CREATED)
  create(
    @Param('postId') postId: string,
    @Body() createCommentDto: CreateCommentDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.commentsService.create(
      postId,
      createCommentDto,
      request.user.sub,
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put(':commentId')
  update(
    @Param('commentId') commentId: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.commentsService.update(
      commentId,
      updateCommentDto,
      request.user.sub,
    );
  }
}
