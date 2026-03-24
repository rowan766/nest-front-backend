import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AssignMenusDto } from './dto/assign-menus.dto';
import { SetDataScopeDto } from './dto/set-data-scope.dto';
import { QueryRoleDto } from './dto/query-role.dto';
import { JwtAuthGuard } from '../auth';

@ApiTags('角色管理')
@Controller('role')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('Authorization')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @ApiOperation({ summary: '创建角色' })
  @ApiResponse({ status: 201, description: '创建成功' })
  @ApiResponse({ status: 409, description: '角色名称或编码已存在' })
  @ApiResponse({ status: 401, description: '未授权' })
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @Get()
  @ApiOperation({ summary: '获取角色列表' })
  @ApiResponse({ status: 200, description: '获取成功' })
  @ApiResponse({ status: 401, description: '未授权' })
  findAll(@Query() queryRoleDto: QueryRoleDto) {
    return this.roleService.findAll(queryRoleDto);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取角色详情' })
  @ApiResponse({ status: 200, description: '获取成功' })
  @ApiResponse({ status: 404, description: '角色不存在' })
  @ApiResponse({ status: 401, description: '未授权' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.roleService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: '完整更新角色' })
  @ApiResponse({ status: 200, description: '更新成功' })
  @ApiResponse({ status: 404, description: '角色不存在' })
  @ApiResponse({ status: 409, description: '角色名称或编码已存在' })
  @ApiResponse({ status: 401, description: '未授权' })
  replace(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return this.roleService.update(id, updateRoleDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: '部分更新角色' })
  @ApiResponse({ status: 200, description: '更新成功' })
  @ApiResponse({ status: 404, description: '角色不存在' })
  @ApiResponse({ status: 409, description: '角色名称或编码已存在' })
  @ApiResponse({ status: 401, description: '未授权' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return this.roleService.update(id, updateRoleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除角色' })
  @ApiResponse({ status: 200, description: '删除成功' })
  @ApiResponse({ status: 404, description: '角色不存在' })
  @ApiResponse({ status: 409, description: '该角色下有用户，无法删除' })
  @ApiResponse({ status: 401, description: '未授权' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.roleService.remove(id);
  }

  @Post(':id/menus')
  @ApiOperation({ summary: '为角色分配菜单权限' })
  @ApiResponse({ status: 200, description: '分配成功' })
  @ApiResponse({ status: 404, description: '角色不存在或部分菜单不存在' })
  @ApiResponse({ status: 401, description: '未授权' })
  assignMenus(
    @Param('id', ParseIntPipe) id: number,
    @Body() assignMenusDto: AssignMenusDto,
  ) {
    return this.roleService.assignMenus(id, assignMenusDto);
  }

  @Post(':id/data-scope')
  @ApiOperation({ summary: '设置角色的数据权限范围' })
  @ApiResponse({ status: 200, description: '设置成功' })
  @ApiResponse({ status: 404, description: '角色不存在或部分部门不存在' })
  @ApiResponse({ status: 400, description: '自定义数据权限必须指定部门列表' })
  @ApiResponse({ status: 401, description: '未授权' })
  setDataScope(
    @Param('id', ParseIntPipe) id: number,
    @Body() setDataScopeDto: SetDataScopeDto,
  ) {
    return this.roleService.setDataScope(id, setDataScopeDto);
  }
}
