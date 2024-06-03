import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUserPayload } from 'src/user/decorator/user-payload.decorator';
import { AccessTokenGuard } from 'src/user/guards/acess-token.guard';
import { TokenPayload } from 'src/user/types/jwt.types';
import { CreateBlogPost } from './dto/create-blog-post.dto';
import { BlogPost } from './entities/blog-post.entity';
import { BlogPostService } from './blog-post.service';
import { PaginationDto } from 'src/common/dto/pagination-input.dto';
import { plainToInstance } from 'class-transformer';
import { UUIDDTO } from 'src/common/dto/uuid.dto';
import { UpdateBlogPostDto } from './dto/update-blog-post.dto';
import { RolesGuard } from 'src/user/guards/roles.guard';
import { Roles } from 'src/user/decorator/roles.decorator';
import { UserRole } from 'src/user/entities/user.entity';

@Controller('blog-post')
export class BlogPostController {
  constructor(
    private readonly blogPostService: BlogPostService,
    // private readonly userService: UserService,
  ) {}

  @Post('createPost')
  @UseGuards(AccessTokenGuard)
  createBlogPost(
    @CurrentUserPayload() currentUserPayload: TokenPayload,
    @Body() input: CreateBlogPost,
  ): Promise<BlogPost> {
    return this.blogPostService.createBlogPost(currentUserPayload, input);
  }

  @Get('getAllPosts')
  async getAllBlogPosts(@Query() input: PaginationDto): Promise<BlogPost[]> {
    const TransformInput = plainToInstance(PaginationDto, input, {
      exposeDefaultValues: true,
      enableImplicitConversion: true,
    });
    console.log('🚀 ~ BlogPostController ~ input:', TransformInput);
    return this.blogPostService.getAllBlogPosts(TransformInput);
  }

  @Get(':id')
  async getOneBlogPost(@Param() input: UUIDDTO): Promise<BlogPost> {
    const post = await this.blogPostService.findOneById(input.id);
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return post;
  }

  @Patch('updatePost')
  @UseGuards(AccessTokenGuard) // Assuming JWT authentication is required
  async updateBlogPost(
    @Body() updateBlogPostInput: UpdateBlogPostDto,
    @CurrentUserPayload() currentUserPayload: TokenPayload,
  ): Promise<BlogPost> {
    return this.blogPostService.updateBlogPost(
      currentUserPayload,
      updateBlogPostInput,
    );
  }

  @Delete(':id') // Use Delete decorator and specify the route parameter
  @UseGuards(AccessTokenGuard)
  async deleteBlogPost(
    @Param() input: UUIDDTO, // Use Body decorator to extract the input from request body
    @CurrentUserPayload() currentUserPayload: TokenPayload,
  ): Promise<boolean> {
    // Call the service method to delete the blog post
    return this.blogPostService.deleteBlogPost(currentUserPayload, input.id);
  }

  @Delete()
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(UserRole.admin)
  async deleteAllPosts(): Promise<boolean> {
    return this.blogPostService.deleteAllBlogPosts();
  }
}
