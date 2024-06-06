import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostComment } from './entities/post-comment.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { CreatePostCommentInput as CreatePostCommentDto } from './dto/create-post-comment.dto';
import { TokenPayload } from 'src/user/types/jwt.types';
import { BlogPostService } from 'src/blog-post/blog-post.service';
import { GetPostCommentsInput } from './dto/get-post-comment.dto';

@Injectable()
export class PostCommentService {
  constructor(
    @InjectRepository(PostComment)
    private readonly postCommentRepository: Repository<PostComment>,
    private readonly blogPostService: BlogPostService,
    private readonly userService: UserService,
  ) {}

  async createPostComment(
    currentUserPayload: TokenPayload,
    input: CreatePostCommentDto,
  ): Promise<PostComment> {
    const author = await this.userService.findOneById(currentUserPayload.sub);
    if (!author) {
      throw new NotFoundException('Author not found');
    }

    const postComment = this.postCommentRepository.create({
      author,
      content: input.content,
    });

    if (input.parent_comment_id) {
      // Get the comment that the user is replying to
      const parentComment = await this.postCommentRepository.findOneBy({
        id: input.parent_comment_id,
      });
      if (!parentComment) {
        throw new NotFoundException('Comment not found');
      }
      postComment.parent_comment_id = input.parent_comment_id;
      postComment.post_id = parentComment.post_id;
    } else {
      if (!input.post_id) {
        throw new BadRequestException(
          'Either post_id or parent_comment_id is required',
        );
      }
      // Get the post that the user is commenting on
      const post = await this.blogPostService.findOneById(input.post_id);
      if (!post) {
        throw new NotFoundException('Post not found');
      }
      postComment.post_id = input.post_id;
    }

    return this.postCommentRepository.save(postComment);
  }

  getPostComments(input: GetPostCommentsInput): Promise<PostComment[]> {
    return this.postCommentRepository.find({
      where: {
        post_id: input.post_id,
      },
      take: input.limit,
      skip: input.offset,
      order: {
        created_at: input.sort,
      },
    });
  }

  async deletePostComment(
    currentUserPayload: TokenPayload,
    commentId: string,
  ): Promise<boolean> {
    const postComment = await this.postCommentRepository.findOneBy({
      id: commentId,
    });
    if (!postComment) {
      throw new NotFoundException('Comment not found');
    }
    if (postComment.author_id !== currentUserPayload.sub) {
      throw new ForbiddenException('You are not the author of this comment');
    }
    await this.postCommentRepository.remove(postComment);
    return true;
  }
}
