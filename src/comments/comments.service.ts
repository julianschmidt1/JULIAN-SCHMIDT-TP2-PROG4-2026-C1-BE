/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comment, CommentDocument } from './schemas/comment.schema';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { GetCommentsQueryDto } from './dto/get-comments-query.dto';
import { CommentResponseDto } from './dto/comment-response.dto';
import { Post, PostDocument } from 'src/posts/schemas/schema';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name)
    private readonly commentModel: Model<CommentDocument>,
    @InjectModel(Post.name)
    private readonly postModel: Model<PostDocument>,
  ) {}

  async findByPost(
    postId: string,
    query: GetCommentsQueryDto,
  ): Promise<CommentResponseDto[]> {
    this.validateObjectId(postId);

    const postExists = await this.postModel.exists({
      _id: postId,
      isActive: true,
    });

    if (!postExists) {
      throw new NotFoundException('Post not found');
    }

    const offset = query.offset ?? 0;
    const limit = query.limit ?? 5;

    const comments = await this.commentModel
      .find({ post: postId, isActive: true })
      .populate('author', 'firstName lastName username profileImageUrl')
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .exec();

    return comments.map((comment) => this.toResponseDto(comment));
  }

  async create(
    postId: string,
    createCommentDto: CreateCommentDto,
    userId: string,
  ): Promise<CommentResponseDto> {
    this.validateObjectId(postId);
    this.validateObjectId(userId);

    const postExists = await this.postModel.exists({
      _id: postId,
      isActive: true,
    });

    if (!postExists) {
      throw new NotFoundException('Post not found');
    }

    const createdComment = await this.commentModel.create({
      post: postId,
      author: userId,
      message: createCommentDto.message,
    });

    const populatedComment = await createdComment.populate(
      'author',
      'firstName lastName username profileImageUrl',
    );

    return this.toResponseDto(populatedComment);
  }

  async update(
    commentId: string,
    updateCommentDto: UpdateCommentDto,
    userId: string,
  ): Promise<CommentResponseDto> {
    this.validateObjectId(commentId);
    this.validateObjectId(userId);

    const comment = await this.commentModel
      .findOne({ _id: commentId, isActive: true })
      .populate('author', 'firstName lastName username profileImageUrl')
      .exec();

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    const author = comment.author as any;
    const authorId = author._id ? author._id.toString() : author.toString();

    if (authorId !== userId) {
      throw new ForbiddenException(
        'You are not allowed to update this comment',
      );
    }

    comment.message = updateCommentDto.message;
    comment.modified = true;

    const updatedComment = await comment.save();

    return this.toResponseDto(updatedComment);
  }

  private toResponseDto(comment: CommentDocument): CommentResponseDto {
    const author = comment.author as any;

    return {
      id: comment._id.toString(),
      post: comment.post.toString(),
      message: comment.message,
      modified: comment.modified,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      author: {
        id: author._id.toString(),
        firstName: author.firstName,
        lastName: author.lastName,
        username: author.username,
        profileImageUrl: author.profileImageUrl,
      },
    };
  }

  private validateObjectId(id: string): void {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Resource not found');
    }
  }
}
