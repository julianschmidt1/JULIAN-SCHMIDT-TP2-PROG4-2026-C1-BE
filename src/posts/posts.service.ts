/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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

    await post.populate(
      'author',
      'firstName lastName username profileImageUrl',
    );

    return this.toResponseDto(post, authorId);
  }

  async update(
    postId: string,
    updatePostDto: UpdatePostDto,
    userId: string,
    userRole: string,
    imageUrl?: string,
  ): Promise<PostResponseDto> {
    this.validateObjectId(postId);

    const post = await this.postModel
      .findById(postId)
      .populate('author', 'firstName lastName username profileImageUrl')
      .exec();

    if (!post || !post.isActive) {
      throw new NotFoundException('Post not found');
    }

    const author = post.author as any;
    const authorId = author._id ? author._id.toString() : author.toString();

    const isAuthor = authorId === userId;
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

    return this.toResponseDto(updatedPost, userId);
  }

  async findAll(
    query: GetPostsQueryDto,
    currentUserId?: string,
  ): Promise<PostResponseDto[]> {
    const offset = Number(query.offset ?? 0);
    const limit = Number(query.limit ?? 10);

    const filter: Record<string, unknown> = {
      isActive: true,
    };

    if (query.userId) {
      filter.author = query.userId;
    }

    if (query.sort === 'likes') {
      const posts = await this.postModel
        .aggregate([
          { $match: filter },
          { $addFields: { likesCount: { $size: '$likes' } } },
          { $sort: { likesCount: -1, createdAt: -1 } },
          { $skip: offset },
          { $limit: limit },
        ])
        .exec();

      const populatedPosts = await this.postModel.populate(posts, {
        path: 'author',
        select: 'firstName lastName username profileImageUrl',
      });

      return populatedPosts.map((post) =>
        this.toResponseDto(post as PostDocument, currentUserId),
      );
    }

    const posts = await this.postModel
      .find(filter)
      .populate('author', 'firstName lastName username profileImageUrl')
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .exec();

    return posts.map((post) => this.toResponseDto(post, currentUserId));
  }

  async delete(
    postId: string,
    userId: string,
    userRole: string,
  ): Promise<PostResponseDto> {
    this.validateObjectId(postId);

    const post = await this.postModel
      .findById(postId)
      .populate('author', 'firstName lastName username profileImageUrl')
      .exec();

    if (!post || !post.isActive) {
      throw new NotFoundException('Post not found');
    }

    const author = post.author as any;
    const authorId = author._id?.toString() ?? author.toString();

    const isAuthor = authorId === userId;
    const isAdministrator = userRole === 'administrator';

    if (!isAuthor && !isAdministrator) {
      throw new ForbiddenException('You are not allowed to delete this post');
    }
    post.isActive = false;

    const deletedPost = await post.save();

    return this.toResponseDto(deletedPost, userId);
  }

  private toResponseDto(
    post: PostDocument,
    currentUserId?: string,
  ): PostResponseDto {
    const author = post.author as any;

    return {
      id: post._id.toString(),
      title: post.title,
      description: post.description,
      imageUrl: post.imageUrl,
      author: {
        id: author._id?.toString() ?? author.toString(),
        firstName: author.firstName ?? '',
        lastName: author.lastName ?? '',
        username: author.username ?? '',
        profileImageUrl: author.profileImageUrl ?? '',
      },
      likes: post.likes.length,
      likedByCurrentUser: currentUserId
        ? post.likes.some(
            (likeUserId) => likeUserId.toString() === currentUserId,
          )
        : false,
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

    const post = await this.postModel
      .findById(postId)
      .populate('author', 'firstName lastName username profileImageUrl')
      .exec();

    if (!post || !post.isActive) {
      throw new NotFoundException('Post not found');
    }

    const alreadyLiked = post.likes.some(
      (likeUserId) => likeUserId.toString() === userId,
    );

    if (!alreadyLiked) {
      post.likes.push(userId as never);
    }

    const updatedPost = await post.save();

    return this.toResponseDto(updatedPost, userId);
  }

  async unlike(postId: string, userId: string): Promise<PostResponseDto> {
    this.validateObjectId(postId);

    const post = await this.postModel
      .findById(postId)
      .populate('author', 'firstName lastName username profileImageUrl')
      .exec();

    if (!post || !post.isActive) {
      throw new NotFoundException('Post not found');
    }

    post.likes = post.likes.filter(
      (likeUserId) => likeUserId.toString() !== userId,
    );

    const updatedPost = await post.save();

    return this.toResponseDto(updatedPost, userId);
  }

  async findById(
    postId: string,
    currentUserId?: string,
  ): Promise<PostResponseDto> {
    this.validateObjectId(postId);

    const post = await this.postModel
      .findById(postId)
      .populate('author', 'firstName lastName username profileImageUrl')
      .exec();

    if (!post || !post.isActive) {
      throw new NotFoundException('Post not found');
    }

    return this.toResponseDto(post, currentUserId);
  }
}
