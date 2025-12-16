import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class PaginationQuery {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize = 20;
}

export function buildPagination(pagination: PaginationQuery): {
  skip: number;
  take: number;
  page: number;
  pageSize: number;
} {
  const page = pagination.page ?? 1;
  const pageSize = pagination.pageSize ?? 20;
  return {
    skip: (page - 1) * pageSize,
    take: pageSize,
    page,
    pageSize,
  };
}
