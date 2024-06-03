import { IsUUID, IsOptional, IsString } from 'class-validator';

export class UpdateBlogPostDto {
  @IsUUID()
  id: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;
}
