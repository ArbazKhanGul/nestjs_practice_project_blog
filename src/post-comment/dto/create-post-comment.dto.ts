import { IsString, IsNotEmpty, IsUUID, IsOptional } from 'class-validator';

export class CreatePostCommentDto {
  @IsUUID()
  @IsOptional()
  post_id?: string;

  @IsUUID()
  @IsOptional()
  parent_comment_id?: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}
