import { ApiPropertyOptional } from '@nestjs/swagger';
import { UserBaseVo } from './user-base.vo';
import { UserDepartmentSummaryVo } from './user-department-summary.vo';
import { UserRoleAssignmentVo } from './user-role-assignment.vo';

export class UserDetailVo extends UserBaseVo {
  @ApiPropertyOptional({
    description: '所属部门信息',
    type: () => UserDepartmentSummaryVo,
  })
  department?: UserDepartmentSummaryVo | null;

  @ApiPropertyOptional({
    description: '用户角色列表',
    type: () => [UserRoleAssignmentVo],
  })
  roles?: UserRoleAssignmentVo[];
}
