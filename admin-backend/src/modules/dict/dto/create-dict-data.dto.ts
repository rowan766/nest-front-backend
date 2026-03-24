import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, MaxLength } from 'class-validator';

export class CreateDictDataDto {
  @ApiProperty({ description: '所属字典类型ID', example: 1 })
  @IsInt()
  dictTypeId: number;

  @ApiProperty({ description: '字典标签（显示值）', example: '男' })
  @IsString()
  @MaxLength(50)
  label: string;

  @ApiProperty({ description: '字典值（实际值）', example: '1' })
  @IsString()
  @MaxLength(50)
  value: string;

  @ApiProperty({ description: '排序', example: 1, required: false })
  @IsInt()
  @IsOptional()
  sort?: number;

  @ApiProperty({ description: '样式类名', example: 'primary', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  cssClass?: string;

  @ApiProperty({ description: '备注', example: '男性用户', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(200)
  remark?: string;

  @ApiProperty({ description: '状态：1启用 0禁用', example: 1, required: false })
  @IsInt()
  @IsOptional()
  status?: number;
}
