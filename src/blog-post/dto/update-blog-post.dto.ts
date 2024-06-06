import { Field, InputType, PartialType, PickType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';
import { BlogPost } from '../entities/blog-post.entity';

@InputType()
export class UpdateBlogPostInput extends PickType(
  PartialType(BlogPost),
  ['title', 'content'],
  InputType,
) {
  @Field(() => String)
  @IsUUID()
  id: string;
}
