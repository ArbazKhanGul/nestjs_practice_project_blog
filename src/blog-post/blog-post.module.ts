import { Module } from '@nestjs/common';
import { BlogPostService } from './blog-post.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { BlogPost } from './entities/blog-post.entity';
import { BlogPostResolver } from './blog-post.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([BlogPost]), UserModule],
  providers: [BlogPostService, BlogPostResolver],
  exports: [BlogPostService],
})
export class BlogPostModule {}
