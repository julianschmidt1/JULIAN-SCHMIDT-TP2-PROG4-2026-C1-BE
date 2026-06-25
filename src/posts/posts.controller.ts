import {
  Req,
  UseGuards,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { UploadsService } from '../uploads/uploads.service';
import { CreatePostDto } from './dto/create-post.dto';
import { PostsService } from './posts.service';
import { GetPostsQueryDto } from './dto/get-posts-query.dto';
import { UpdatePostDto } from './dto/update-post-.dto';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly uploadsService: UploadsService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['title', 'description'],
      properties: {
        title: {
          type: 'string',
          example: 'Titulo publicacion',
        },
        description: {
          type: 'string',
          example: 'Este es el contenido de mi publicacion',
        },
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async create(
    @Body() createPostDto: CreatePostDto,
    @Req() request: AuthenticatedRequest,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const userId = request.user.sub;

    let imageUrl: string | undefined;

    if (file) {
      const uploadResult = await this.uploadsService.uploadImage(file);
      imageUrl = uploadResult.secure_url;
    }

    return this.postsService.create(createPostDto, userId, imageUrl);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('image'))
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          example: 'Título actualizado',
        },
        description: {
          type: 'string',
          example: 'Descripción actualizada.',
        },
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async update(
    @Param('id') postId: string,
    @Body() updatePostDto: UpdatePostDto,
    @Req() request: AuthenticatedRequest,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const userId = request.user.sub;
    const userRole = request.user.role;

    let imageUrl: string | undefined;

    if (file) {
      const uploadResult = await this.uploadsService.uploadImage(file);
      imageUrl = uploadResult.secure_url;
    }

    return this.postsService.update(
      postId,
      updatePostDto,
      userId,
      userRole,
      imageUrl,
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(
    @Query() query: GetPostsQueryDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.postsService.findAll(query, request.user.sub);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') postId: string, @Req() request: AuthenticatedRequest) {
    return this.postsService.delete(
      postId,
      request.user.sub,
      request.user.role,
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id/like')
  like(@Param('id') postId: string, @Req() request: AuthenticatedRequest) {
    return this.postsService.like(postId, request.user.sub);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id/like')
  unlike(@Param('id') postId: string, @Req() request: AuthenticatedRequest) {
    return this.postsService.unlike(postId, request.user.sub);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findById(@Param('id') postId: string, @Req() request: AuthenticatedRequest) {
    return this.postsService.findById(postId, request.user.sub);
  }
}

interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}
