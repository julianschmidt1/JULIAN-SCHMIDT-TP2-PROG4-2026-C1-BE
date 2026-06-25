import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

import { User } from '../../users/schemas/user';
import { Post } from 'src/posts/schemas/schema';

@Schema({ timestamps: true })
export class Comment {
  @Prop({
    type: Types.ObjectId,
    ref: Post.name,
    required: true,
  })
  post!: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true,
  })
  author!: Types.ObjectId;

  @Prop({
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 500,
  })
  message!: string;

  @Prop({
    default: false,
  })
  modified!: boolean;

  @Prop({
    default: true,
  })
  isActive!: boolean;

  createdAt!: Date;
  updatedAt!: Date;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
export type CommentDocument = HydratedDocument<Comment>;
