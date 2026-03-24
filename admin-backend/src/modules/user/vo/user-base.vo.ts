import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserBaseVo {
  @ApiProperty({ description: '用户ID', example: 1 })
  id: number;

  @ApiProperty({ description: '用户名', example: 'admin' })
  username: string;

  @ApiPropertyOptional({
    description: '昵称',
    example: '管理员',
    type: String,
    nullable: true,
  })
  nickname?: string | null;

  @ApiPropertyOptional({
    description: '邮箱',
    example: 'admin@example.com',
    type: String,
    nullable: true,
  })
  email?: string | null;

  @ApiPropertyOptional({
    description: '手机号',
    example: '13800138000',
    type: String,
    nullable: true,
  })
  phone?: string | null;

  @ApiPropertyOptional({
    description: '头像路径',
    example: 'http://localhost:19000/user-avatars/avatar.png',
    type: String,
    nullable: true,
  })
  avatar?: string | null;

  @ApiPropertyOptional({
    description: '头像文件ID',
    example: 1,
    type: Number,
    nullable: true,
  })
  avatarId?: number | null;

  @ApiPropertyOptional({
    description: '头像文件名',
    example: 'avatar.png',
    type: String,
    nullable: true,
  })
  avatarName?: string | null;

  @ApiPropertyOptional({
    description: '所属部门ID',
    example: 1,
    type: Number,
    nullable: true,
  })
  departmentId?: number | null;

  @ApiProperty({ description: '状态：1启用 0禁用', example: 1 })
  status: number;

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
