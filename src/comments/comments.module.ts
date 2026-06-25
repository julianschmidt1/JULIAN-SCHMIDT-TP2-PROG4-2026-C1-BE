import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { type StringValue } from 'ms';

import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { Comment, CommentSchema } from './schemas/comment.schema';
import { Post, PostSchema } from 'src/posts/schemas/schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Comment.name, schema: CommentSchema },
      { name: Post.name, schema: PostSchema },
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: (configService.get<string>('JWT_EXPIRES_IN') ??
            '15m') as StringValue,
        },
      }),
    }),
  ],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
