import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBlogPost {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}
