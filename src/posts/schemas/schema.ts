import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from 'src/users/schemas/user';

@Schema({ timestamps: true })
export class Post {
  @Prop({
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 100,
  })
  title!: string;

  @Prop({
    required: true,
    trim: true,
    maxlength: 1000,
  })
  description!: string;

  @Prop()
  imageUrl?: string;

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true,
  })
  author!: Types.ObjectId;

  @Prop({
    type: [{ type: Types.ObjectId, ref: User.name }],
    default: [],
  })
  likes!: Types.ObjectId[];

  @Prop({
    default: true,
  })
  isActive!: boolean;

  createdAt!: Date;
  updatedAt!: Date;
}

export const PostSchema = SchemaFactory.createForClass(Post);
export type PostDocument = HydratedDocument<Post>;
