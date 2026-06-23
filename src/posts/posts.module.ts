import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './schemas/schema';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { UploadsModule } from 'src/uploads/uploads.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Post.name,
        schema: PostSchema,
      },
    ]),
    UploadsModule,
  ],
  providers: [PostsService],
  controllers: [PostsController],
})
export class PostsModule {}
