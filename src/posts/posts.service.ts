import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { CreatePostDto } from './dto/create-post.dto';
import { PostResponseDto } from './dto/post-response.dto';
import { Post, PostDocument } from './schemas/schema';
import { GetPostsQueryDto } from './dto/get-posts-query.dto';
import { UpdatePostDto } from './dto/update-post-.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name)
    private readonly postModel: Model<PostDocument>,
  ) {}

  async create(
    createPostDto: CreatePostDto,
    authorId: string,
    imageUrl?: string,
  ): Promise<PostResponseDto> {
    const post = await this.postModel.create({
      ...createPostDto,
      imageUrl,
      author: authorId,
    });

    return this.toResponseDto(post);
  }

  async update(
    postId: string,
    updatePostDto: UpdatePostDto,
    userId: string,
    userRole: string,
    imageUrl?: string,
  ): Promise<PostResponseDto> {
    this.validateObjectId(postId);

    const post = await this.postModel.findById(postId).exec();

    if (!post || !post.isActive) {
      throw new NotFoundException('Post not found');
    }

    const isAuthor = post.author.toString() === userId;
    const isAdministrator = userRole === 'administrator';

    if (!isAuthor && !isAdministrator) {
      throw new ForbiddenException('You are not allowed to update this post');
    }

    if (updatePostDto.title !== undefined) {
      post.title = updatePostDto.title;
    }

    if (updatePostDto.description !== undefined) {
      post.description = updatePostDto.description;
    }

    if (imageUrl !== undefined) {
      post.imageUrl = imageUrl;
    }

    const updatedPost = await post.save();

    return this.toResponseDto(updatedPost);
  }

  async findAll(query: GetPostsQueryDto): Promise<PostResponseDto[]> {
    const offset = Number(query.offset ?? 0);
    const limit = Number(query.limit ?? 10);

    const filter: Record<string, unknown> = {
      isActive: true,
    };

    if (query.userId) {
      filter.author = query.userId;
    }

    const posts = await this.postModel
      .find(filter)
      .sort(query.sort === 'likes' ? { likes: -1 } : { createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .exec();

    return posts.map((post) => this.toResponseDto(post));
  }

  async delete(
    postId: string,
    userId: string,
    userRole: string,
  ): Promise<PostResponseDto> {
    this.validateObjectId(postId);

    const post = await this.postModel.findById(postId).exec();

    if (!post || !post.isActive) {
      throw new NotFoundException('Post not found');
    }

    const isAuthor = post.author.toString() === userId;
    const isAdministrator = userRole === 'administrator';

    if (!isAuthor && !isAdministrator) {
      throw new ForbiddenException('You are not allowed to delete this post');
    }

    post.isActive = false;

    const deletedPost = await post.save();

    return this.toResponseDto(deletedPost);
  }

  private toResponseDto(post: PostDocument): PostResponseDto {
    return {
      id: post._id.toString(),
      title: post.title,
      description: post.description,
      imageUrl: post.imageUrl,
      author: post.author.toString(),
      likes: post.likes.length,
      isActive: post.isActive,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  }

  private validateObjectId(id: string): void {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid post id');
    }
  }

  async like(postId: string, userId: string): Promise<PostResponseDto> {
    this.validateObjectId(postId);

    const post = await this.postModel.findById(postId).exec();

    if (!post || !post.isActive) {
      throw new NotFoundException('Post not found');
    }

    const alreadyLiked = post.likes.some((likeUserId) => {
      return likeUserId.toString() === userId;
    });

    if (!alreadyLiked) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      post.likes.push(userId as any);
    }

    const updatedPost = await post.save();

    return this.toResponseDto(updatedPost);
  }

  async unlike(postId: string, userId: string): Promise<PostResponseDto> {
    this.validateObjectId(postId);

    const post = await this.postModel.findById(postId).exec();

    if (!post || !post.isActive) {
      throw new NotFoundException('Post not found');
    }

    post.likes = post.likes.filter((likeUserId) => {
      return likeUserId.toString() !== userId;
    });

    const updatedPost = await post.save();

    return this.toResponseDto(updatedPost);
  }

  async findById(postId: string): Promise<PostResponseDto> {
    this.validateObjectId(postId);

    const post = await this.postModel.findById(postId).exec();

    if (!post || !post.isActive) {
      throw new NotFoundException('Post not found');
    }

    return this.toResponseDto(post);
  }
}
