import { Field, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination-input.dto';

@InputType()
export class GetPostCommentsInput extends PaginationDto {
  @Field(() => String)
  @IsUUID()
  post_id: string;
}
