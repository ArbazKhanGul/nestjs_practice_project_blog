import { Module } from '@nestjs/common';
import { PostCommentController } from './post-comment.controller';
import { PostCommentService } from './post-comment.service';
import { BlogPostModule } from 'src/blog-post/blog-post.module';
import { UserModule } from 'src/user/user.module';
import { PostComment } from './entities/post-comment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostComment]),
    UserModule,
    BlogPostModule,
  ],
  controllers: [PostCommentController],
  providers: [PostCommentService],
})
export class PostCommentModule {}
