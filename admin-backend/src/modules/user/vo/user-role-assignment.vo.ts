import { ApiProperty } from '@nestjs/swagger';
import { UserRoleSummaryVo } from './user-role-summary.vo';

export class UserRoleAssignmentVo {
  @ApiProperty({ description: '角色ID', example: 1 })
  roleId: number;

  @ApiProperty({
    description: '角色分配时间',
    example: '2026-03-22T06:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: '角色信息',
    type: () => UserRoleSummaryVo,
  })
  role: UserRoleSummaryVo;
}
