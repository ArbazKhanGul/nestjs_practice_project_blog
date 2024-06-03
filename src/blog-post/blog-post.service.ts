import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogPost } from './entities/blog-post.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { TokenPayload } from 'src/user/types/jwt.types';
import { CreateBlogPost } from './dto/create-blog-post.dto';
import { PaginationDto } from 'src/common/dto/pagination-input.dto';
import { UpdateBlogPostDto } from './dto/update-blog-post.dto';

@Injectable()
export class BlogPostService {
  constructor(
    @InjectRepository(BlogPost)
    private blogPostRepository: Repository<BlogPost>,
    private readonly userService: UserService,
  ) {}

  async createBlogPost(
    currentUserPayload: TokenPayload,
    input: CreateBlogPost,
  ): Promise<BlogPost> {
    const author = await this.userService.findOneById(currentUserPayload.sub);

    if (!author) {
      throw new NotFoundException('Author not found');
    }

    const blogPost = this.blogPostRepository.create({
      author,
      title: input.title,
      content: input.content,
    });

    const savedBlogPost = await this.blogPostRepository.save(blogPost);

    return savedBlogPost;
  }

  getAllBlogPosts({ limit, offset, sort }: PaginationDto): Promise<BlogPost[]> {
    return this.blogPostRepository.find({
      order: {
        created_at: sort,
      },
      take: limit,
      skip: offset,
    });
  }

  findOneById(id: string): Promise<BlogPost | null> {
    console.log('🚀 ~ BlogPostService ~ findOneById ~ id:', id);
    return this.blogPostRepository.findOneBy({
      id,
    });
  }

  async updateBlogPost(
    currentUserPayload: TokenPayload,
    input: UpdateBlogPostDto,
  ): Promise<BlogPost> {
    console.log('🚀 ~ BlogPostService ~ input:', input.title);
    const blogPost = await this.blogPostRepository.findOne({
      where: {
        id: input.id,
      },
      relations: ['author'],
    });
    console.log('🚀 ~ BlogPostService ~ blogPost:', blogPost);

    if (!blogPost) {
      throw new NotFoundException('Post not found');
    }

    if (blogPost.author_id !== currentUserPayload.sub) {
      throw new ForbiddenException('You are not allowed to update this post');
    }

    const updatedBlogPost = this.blogPostRepository.merge(blogPost, {
      title: input.title,
      content: input.content,
    });

    return this.blogPostRepository.save(updatedBlogPost);
  }

  async deleteBlogPost(
    currentUserPayload: TokenPayload,
    id: string,
  ): Promise<boolean> {
    const blogPost = await this.blogPostRepository.findOneBy({
      id,
    });
    if (!blogPost) {
      throw new NotFoundException('Post not found');
    }
    if (blogPost.author_id !== currentUserPayload.sub) {
      throw new ForbiddenException('You are not the author of this post');
    }
    await this.blogPostRepository.remove(blogPost);
    return true;
  }

  async deleteAllBlogPosts(): Promise<boolean> {
    await this.blogPostRepository.delete({});
    return true;
  }
}
