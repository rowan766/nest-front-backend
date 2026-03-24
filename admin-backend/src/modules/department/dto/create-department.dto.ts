import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, MaxLength, IsEmail } from 'class-validator';

export class CreateDepartmentDto {
  @ApiProperty({ description: '部门名称', example: '技术部' })
  @IsString()
  @MaxLength(50)
  name: string;

  @ApiProperty({ description: '部门编码', example: 'tech', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  code?: string;

  @ApiProperty({ description: '父部门ID', example: 1, required: false })
  @IsInt()
  @IsOptional()
  parentId?: number;

  @ApiProperty({ description: '部门负责人ID', example: 1, required: false })
  @IsInt()
  @IsOptional()
  leaderId?: number;

  @ApiProperty({ description: '部门电话', example: '027-88888888', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  phone?: string;

  @ApiProperty({ description: '部门邮箱', example: 'tech@example.com', required: false })
  @IsEmail()
  @IsOptional()
  @MaxLength(100)
  email?: string;

  @ApiProperty({ description: '排序', example: 1, required: false })
  @IsInt()
  @IsOptional()
  sort?: number;

  @ApiProperty({ description: '部门描述', example: '负责技术研发', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(200)
  description?: string;
}