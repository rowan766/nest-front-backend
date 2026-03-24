import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserDepartmentSummaryVo {
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
}
