import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class QueryRoleDto {
  @IsInt()
  @Min(1)
  @Type(() => Number)
  @IsOptional()
  page = 1;

  @IsInt()
  @Min(1)
  @Type(() => Number)
  @IsOptional()
  pageSize = 10;

  @IsString()
  @MaxLength(50)
  @IsOptional()
  name?: string;

  @IsString()
  @MaxLength(50)
  @IsOptional()
  code?: string;

  @IsInt()
  @IsIn([0, 1])
  @Type(() => Number)
  @IsOptional()
  status?: number;
}
