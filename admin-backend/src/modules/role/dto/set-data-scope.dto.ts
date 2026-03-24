import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsArray, IsOptional, Min, Max } from 'class-validator';

export class SetDataScopeDto {
  @ApiProperty({
    description: '数据权限范围：1全部 2本部门及以下 3本部门 4仅本人 5自定义',
    example: 5,
    minimum: 1,
    maximum: 5,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  dataScope: number;

  @ApiProperty({
    description: '自定义数据权限的部门ID列表（dataScope=5时必填）',
    example: [1, 2, 3],
    type: [Number],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @IsInt({ each: true })
  departmentIds?: number[];
}
