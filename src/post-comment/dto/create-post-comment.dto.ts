import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreatePostCommentDto {
  @IsUUID()
  post_id: string;

  @IsUUID()
  parent_comment_id?: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}
