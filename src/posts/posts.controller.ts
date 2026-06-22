import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiHeader, ApiTags } from '@nestjs/swagger';

import { UploadsService } from '../uploads/uploads.service';
import { CreatePostDto } from './dto/create-post.dto';
import { PostsService } from './posts.service';
import { GetPostsQueryDto } from './dto/get-posts-query.dto';
import { UpdatePostDto } from './dto/update-post-.dto';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly uploadsService: UploadsService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  @ApiHeader({
    name: 'x-user-id',
    required: true,
    description: 'user id (hasta poner jwt)',
  })
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
    @Headers('x-user-id') userId: string,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (!userId) {
      throw new BadRequestException('User id is required');
    }

    let imageUrl: string | undefined;

    if (file) {
      const uploadResult = await this.uploadsService.uploadImage(file);
      imageUrl = uploadResult.secure_url;
    }

    return this.postsService.create(createPostDto, userId, imageUrl);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('image'))
  @ApiHeader({
    name: 'x-user-id',
    required: true,
    description: 'user id (hasta poner jwt)',
  })
  @ApiHeader({
    name: 'x-user-role',
    required: true,
    description: 'user role(hasta poner jwt)',
  })
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
    @Headers('x-user-id') userId: string,
    @Headers('x-user-role') userRole: string,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (!userId) {
      throw new BadRequestException('User id is required');
    }

    if (!userRole) {
      throw new BadRequestException('User role is required');
    }

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

  @Get()
  findAll(
    @Query() query: GetPostsQueryDto,
    @Headers('x-user-id') userId?: string,
  ) {
    return this.postsService.findAll(query, userId);
  }

  @Delete(':id')
  @ApiHeader({
    name: 'x-user-id',
    required: true,
    description: 'user id (hasta poner jwt)',
  })
  @ApiHeader({
    name: 'x-user-role',
    required: true,
    description: 'administrator o user (hasta poner jwt)',
  })
  delete(
    @Param('id') postId: string,
    @Headers('x-user-id') userId: string,
    @Headers('x-user-role') userRole: string,
  ) {
    if (!userId) {
      throw new BadRequestException('User id is required');
    }

    if (!userRole) {
      throw new BadRequestException('User role is required');
    }

    return this.postsService.delete(postId, userId, userRole);
  }

  @Post(':id/like')
  @ApiHeader({
    name: 'x-user-id',
    required: true,
    description: 'user id (hasta poner jwt)',
  })
  toggleLike(
    @Param('id') postId: string,
    @Headers('x-user-id') userId: string,
  ) {
    if (!userId) {
      throw new BadRequestException('User id is required');
    }

    return this.postsService.toggleLike(postId, userId);
  }

  @Get(':id')
  findById(@Param('id') postId: string, @Headers('x-user-id') userId?: string) {
    return this.postsService.findById(postId, userId);
  }
}
