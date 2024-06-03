import { IsUUID } from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination-input.dto';

export class GetPostCommentsInput extends PaginationDto {
  @IsUUID()
  post_id: string;
}
