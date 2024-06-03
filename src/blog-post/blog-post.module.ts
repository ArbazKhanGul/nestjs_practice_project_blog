import { Module } from '@nestjs/common';
import { BlogPostController } from './blog-post.controller';
import { BlogPostService } from './blog-post.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { BlogPost } from './entities/blog-post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BlogPost]), UserModule],
  controllers: [BlogPostController],
  providers: [BlogPostService],
})
export class BlogPostModule {}
