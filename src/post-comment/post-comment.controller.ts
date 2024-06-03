import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreatePostCommentDto } from './dto/create-post-comment.dto';
import { TokenPayload } from 'src/user/types/jwt.types';
import { CurrentUserPayload } from 'src/user/decorator/user-payload.decorator';
import { AccessTokenGuard } from 'src/user/guards/acess-token.guard';
import { PostCommentService } from './post-comment.service';
import { PostComment } from './entities/post-comment.entity';
import { GetPostCommentsInput } from './dto/get-post-comment.dto';
import { UUIDDTO } from 'src/common/dto/uuid.dto';

@Controller('post-comment')
export class PostCommentController {
  constructor(private readonly postCommentService: PostCommentService) {}
  @Post()
  @UseGuards(AccessTokenGuard)
  async createPostComment(
    @CurrentUserPayload() currentUserPayload: TokenPayload,
    @Body() input: CreatePostCommentDto,
  ) {
    return this.postCommentService.createPostComment(currentUserPayload, input);
  }

  @Get()
  getPostComments(@Body() input: GetPostCommentsInput): Promise<PostComment[]> {
    return this.postCommentService.getPostComments(input);
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard)
  async deletePostComment(
    @CurrentUserPayload() currentUserPayload: TokenPayload,
    @Param() input: UUIDDTO,
  ) {
    return this.postCommentService.deletePostComment(
      currentUserPayload,
      input.id,
    );
  }
}
