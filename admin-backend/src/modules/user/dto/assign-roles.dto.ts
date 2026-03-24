import { ApiProperty } from '@nestjs/swagger';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsInt } from 'class-validator';

export class AssignRolesDto {
  @ApiPropertyOptional({ description: '角色ID列表', example: [1, 2], type: [Number], default: [] })
  @IsArray()
  @IsInt({ each: true })
  roleIds: number[];
}
