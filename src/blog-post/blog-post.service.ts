import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
// import { User } from 'src/user/entities';
import { TokenPayload } from 'src/user/types/jwt.types';
import { PaginationDto as PaginationInput } from 'src/common/dto';
import { CreateBlogPostInput, UpdateBlogPostInput } from './dto';
import { BlogPost } from './entities/blog-post.entity';

/**
 * Service for operations related to `BlogPost` entity.
 */
@Injectable()
export class BlogPostService {
  constructor(
    @InjectRepository(BlogPost)
    private blogPostRepository: Repository<BlogPost>,
    private readonly userService: UserService,
  ) {}

  /**
   * Creates a new `BlogPost` and Index it in Elasticsearch (via BlogPostSubscriber).
   * @param currentUserPayload - Logged in `User` payload
   * @param input - Input data to create a new `BlogPost`
   * @returns Created `BlogPost` object from the database
   * @throws `NotFoundException` If the `User / author` is not found
   */
  async createBlogPost(
    currentUserPayload: TokenPayload,
    input: CreateBlogPostInput,
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

  /**
   * Get all `BlogPost` from the database with pagination
   * @param input - Pagination options
   * @returns Array of `BlogPost` objects
   */
  getAllBlogPosts({
    limit,
    offset,
    sort,
  }: PaginationInput): Promise<BlogPost[]> {
    return this.blogPostRepository.find({
      order: {
        created_at: sort,
      },
      take: limit,
      skip: offset,
    });
  }

  /**
   * Get a single `BlogPost` by ID
   * @param id - ID of the `BlogPost`
   * @returns `BlogPost` if found, `null` otherwise
   */
  findOneById(id: string): Promise<BlogPost | null> {
    return this.blogPostRepository.findOneBy({
      id,
    });
  }

  /**
   * Update a `BlogPost` in Database and Elasticsearch (via BlogPostSubscriber).
   *
   * Only the `author` of the `BlogPost` is allowed to update it.
   *
   * Only `title` and `content` fields can be updated.
   *
   * @param currentUserPayload - Logged in `User` payload
   * @param input - Input data to update the `BlogPost`
   * @returns Updated `BlogPost` object from the database
   * @throws `ForbiddenException` If the `User` is not allowed to update the `BlogPost`
   * @throws `NotFoundException` If the `BlogPost` is not found
   */
  async updateBlogPost(
    currentUserPayload: TokenPayload,
    input: UpdateBlogPostInput,
  ): Promise<BlogPost> {
    const blogPost = await this.blogPostRepository.findOne({
      where: {
        id: input.id,
      },
      relations: ['author'],
    });

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

  /**
   * Delete a `BlogPost` from Database and Elasticsearch (via BlogPostSubscriber)
   *
   * Only the `author` of the `BlogPost` is allowed to delete it.
   *
   * All the associated `PostComment` with the `BlogPost` will be deleted by onDelete: 'CASCADE'.
   *
   * @param currentUserPayload - Logged in `User` payload
   * @param id - ID of the `BlogPost`
   * @returns `true` if the `BlogPost` is deleted successfully
   * @throws `NotFoundException` If the `BlogPost` is not found
   * @throws `ForbiddenException` If the `User` is not the `author` of the `BlogPost`
   */
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

  /**
   *  Delete all `BlogPost` from the database and Elasticsearch
   *
   * Intended to be used by `admin` only for seeding data.
   *
   * @returns `true` if all `BlogPost` are deleted successfully
   */
  async deleteAllBlogPosts(): Promise<boolean> {
    await this.blogPostRepository.delete({});
    return true;
  }
}
