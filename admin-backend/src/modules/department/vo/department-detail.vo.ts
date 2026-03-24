import { ApiPropertyOptional } from '@nestjs/swagger';
import { DepartmentBaseVo } from './department-base.vo';
import { DepartmentUserSummaryVo } from './department-user-summary.vo';

export class DepartmentDetailVo extends DepartmentBaseVo {
  @ApiPropertyOptional({
    description: '部门下的用户列表',
    type: () => [DepartmentUserSummaryVo],
  })
  users?: DepartmentUserSummaryVo[];
}
