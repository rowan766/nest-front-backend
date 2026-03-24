import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, MaxLength } from 'class-validator';

export class CreateDictTypeDto {
  @ApiProperty({ description: '字典名称', example: '用户性别' })
  @IsString()
  @MaxLength(50)
  name: string;

  @ApiProperty({ description: '字典编码', example: 'user_gender' })
  @IsString()
  @MaxLength(50)
  code: string;

  @ApiProperty({ description: '字典描述', example: '用户性别字典', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(200)
  description?: string;

  @ApiProperty({ description: '排序', example: 1, required: false })
  @IsInt()
  @IsOptional()
  sort?: number;

  @ApiProperty({ description: '状态：1启用 0禁用', example: 1, required: false })
  @IsInt()
  @IsOptional()
  status?: number;
}
