import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class PageRequestDto {
  @IsInt()
  @Type(() => Number)
  page = 1;
  total_page?: number;

  @IsInt()
  @Type(() => Number)
  pageSize = 10;

  @IsInt()
  @IsOptional()
  limit;

  @IsString()
  @IsOptional()
  sort_by: string;

  @IsString()
  @IsOptional()
  order_by: string;
}
