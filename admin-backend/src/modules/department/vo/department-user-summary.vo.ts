import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DepartmentUserSummaryVo {
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
}
