import { ApiProperty } from '@nestjs/swagger';

export class UserRoleSummaryVo {
  @ApiProperty({ description: '角色ID', example: 1 })
  id: number;

  @ApiProperty({ description: '角色名称', example: '管理员' })
  name: string;

  @ApiProperty({ description: '角色编码', example: 'admin' })
  code: string;
}
