import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, MaxLength, Min, Max } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ description: '角色名称', example: '管理员' })
  @IsString()
  @MaxLength(50)
  name: string;

  @ApiProperty({ description: '角色编码', example: 'admin' })
  @IsString()
  @MaxLength(50)
  code: string;

  @ApiProperty({ description: '角色描述', example: '系统管理员角色', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(200)
  description?: string;

  @ApiProperty({
    description: '数据权限范围：1全部 2本部门及以下 3本部门 4仅本人 5自定义',
    example: 1,
    minimum: 1,
    maximum: 5,
    required: false,
  })
  @IsInt()
  @IsOptional()
  @Min(1)
  @Max(5)
  dataScope?: number;

  @ApiProperty({ description: '排序', example: 1, required: false })
  @IsInt()
  @IsOptional()
  sort?: number;

  @ApiProperty({ description: '状态：1启用 0禁用', example: 1, required: false })
  @IsInt()
  @IsOptional()
  status?: number;
}
