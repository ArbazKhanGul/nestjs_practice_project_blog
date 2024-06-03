import { IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit: number = 10;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  offset: number = 0;

  @IsOptional()
  sort: SortOrder = SortOrder.ASC;
}
