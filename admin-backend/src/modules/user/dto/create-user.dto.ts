import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsOptional,
  MinLength,
  MaxLength,
  IsInt,
  IsIn,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: '用户名', example: 'admin' })
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  username: string;

  @ApiProperty({ description: '密码', example: '123456' })
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  password: string;

  @ApiPropertyOptional({ description: '昵称', example: '管理员' })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  nickname?: string;

  @ApiPropertyOptional({ description: '邮箱', example: 'admin@example.com' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ description: '手机号', example: '13800138000' })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  phone?: string;

  @ApiPropertyOptional({ description: '所属部门ID', example: 1 })
  @IsInt()
  @IsOptional()
  departmentId?: number;

  @ApiPropertyOptional({ description: '头像文件ID', example: 1 })
  @IsInt()
  @IsOptional()
  avatarId?: number;

  @ApiPropertyOptional({ description: '头像文件名', example: '头像.jpg' })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  avatarName?: string;

  @ApiPropertyOptional({ description: '状态：1启用 0禁用', example: 1 })
  @IsInt()
  @IsIn([0, 1])
  @IsOptional()
  status?: number;
}
