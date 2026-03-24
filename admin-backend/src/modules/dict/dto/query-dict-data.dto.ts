import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class QueryDictDataDto {
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

  @IsInt()
  @Type(() => Number)
  @IsOptional()
  dictTypeId?: number;

  @IsString()
  @MaxLength(50)
  @IsOptional()
  label?: string;

  @IsString()
  @MaxLength(50)
  @IsOptional()
  value?: string;

  @IsInt()
  @IsIn([0, 1])
  @Type(() => Number)
  @IsOptional()
  status?: number;
}
