import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, MaxLength, IsIn } from 'class-validator';

export class CreateMenuDto {
  @ApiProperty({ description: '父菜单ID', example: 1, required: false })
  @IsInt()
  @IsOptional()
  parentId?: number;

  @ApiProperty({ description: '菜单名称（菜单为路由name，按钮可省略）', example: 'UserManage', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  name?: string;

  @ApiProperty({ description: '菜单标题（显示名称）', example: '用户管理' })
  @IsString()
  @MaxLength(50)
  title: string;

  @ApiProperty({ description: '类型：menu菜单 button按钮', example: 'menu', enum: ['menu', 'button'] })
  @IsString()
  @IsIn(['menu', 'button'])
  type: string;

  @ApiProperty({ description: '路由路径（菜单用）', example: '/user', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(200)
  path?: string;

  @ApiProperty({ description: '组件路径（菜单用）', example: 'views/user/index', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(200)
  component?: string;

  @ApiProperty({ description: '权限标识（按钮用）', example: 'user:create', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  permission?: string;

  @ApiProperty({ description: '图标', example: 'UserOutlined', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  icon?: string;

  @ApiProperty({ description: '排序', example: 1, required: false })
  @IsInt()
  @IsOptional()
  sort?: number;

  @ApiProperty({ description: '是否可见：1可见 0隐藏', example: 1, required: false })
  @IsInt()
  @IsOptional()
  visible?: number;

  @ApiProperty({ description: '状态：1启用 0禁用', example: 1, required: false })
  @IsInt()
  @IsOptional()
  status?: number;
}
