import { ApiPropertyOptional } from '@nestjs/swagger';
import { DepartmentBaseVo } from './department-base.vo';

export class DepartmentTreeVo extends DepartmentBaseVo {
  @ApiPropertyOptional({
    description: '子部门列表',
    type: () => [DepartmentTreeVo],
  })
  children?: DepartmentTreeVo[];
}
