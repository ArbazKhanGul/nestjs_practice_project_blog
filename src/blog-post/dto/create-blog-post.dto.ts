import { InputType, PickType } from '@nestjs/graphql';
import { BlogPost } from '../entities/blog-post.entity';

@InputType()
export class CreateBlogPostInput extends PickType(
  BlogPost,
  ['title', 'content'],
  InputType,
) {}
