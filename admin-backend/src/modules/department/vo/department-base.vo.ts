import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DepartmentBaseVo {
  @ApiProperty({ description: '部门ID', example: 1 })
  id: number;

  @ApiProperty({ description: '部门名称', example: '总部' })
  name: string;

  @ApiPropertyOptional({
    description: '部门编码',
    example: 'root',
    type: String,
    nullable: true,
  })
  code?: string | null;

  @ApiPropertyOptional({
    description: '父部门ID',
    example: null,
    type: Number,
    nullable: true,
  })
  parentId?: number | null;

  @ApiPropertyOptional({
    description: '负责人用户ID',
    example: 1,
    type: Number,
    nullable: true,
  })
  leaderId?: number | null;

  @ApiPropertyOptional({
    description: '部门电话',
    example: '027-00000000',
    type: String,
    nullable: true,
  })
  phone?: string | null;

  @ApiPropertyOptional({
    description: '部门邮箱',
    example: 'root@example.com',
    type: String,
    nullable: true,
  })
  email?: string | null;

  @ApiProperty({ description: '排序', example: 0 })
  sort: number;

  @ApiProperty({ description: '状态：1启用 0禁用', example: 1 })
  status: number;

  @ApiPropertyOptional({
    description: '部门描述',
    example: '系统根部门',
    type: String,
    nullable: true,
  })
  description?: string | null;

  @ApiProperty({
    description: '创建时间',
    example: '2026-03-22T06:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: '更新时间',
    example: '2026-03-22T06:30:00.000Z',
  })
  updatedAt: Date;
}
