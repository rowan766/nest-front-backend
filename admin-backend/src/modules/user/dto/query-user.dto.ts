import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class QueryUserDto {
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
  username?: string;

  @IsString()
  @MaxLength(100)
  @IsOptional()
  email?: string;
}
