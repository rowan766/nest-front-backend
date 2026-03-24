import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import {
  ApiMessageResponse,
  ApiSuccessArrayResponse,
  ApiSuccessResponse,
} from '../../common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { AssignRolesDto } from './dto/assign-roles.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { UserBaseVo, UserDetailVo } from './vo';

@ApiTags('用户管理')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('Authorization')
  @ApiOperation({ summary: '创建用户' })
  @ApiSuccessResponse(UserBaseVo, { status: 201, description: '创建成功' })
  @ApiResponse({ status: 409, description: '用户名已存在' })
  @ApiResponse({ status: 404, description: '部门不存在' })
  @ApiResponse({ status: 401, description: '未授权' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('Authorization')
  @ApiOperation({ summary: '获取用户列表' })
  @ApiSuccessArrayResponse(UserDetailVo, { description: '获取成功' })
  @ApiResponse({ status: 401, description: '未授权' })
  findAll(@Query() queryUserDto: QueryUserDto) {
    return this.userService.findAll(queryUserDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('Authorization')
  @ApiOperation({ summary: '获取当前登录用户信息' })
  @ApiSuccessResponse(UserDetailVo, { description: '获取成功' })
  @ApiResponse({ status: 401, description: '未授权' })
  getProfile(@Request() req) {
    // req.user 是 JwtStrategy 中 validate 方法返回的用户信息
    return req.user;
  }

  @Patch('password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('Authorization')
  @ApiOperation({ summary: '修改密码' })
  @ApiMessageResponse({ description: '修改成功' })
  @ApiResponse({ status: 401, description: '未授权' })
  @ApiResponse({ status: 409, description: '旧密码错误' })
  updatePassword(@Request() req, @Body() updatePasswordDto: UpdatePasswordDto) {
    // req.user.id 是当前登录用户的 ID
    return this.userService.updatePassword(req.user.id, updatePasswordDto);
  }

  @Get('current/menus')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('Authorization')
  @ApiOperation({ summary: '获取当前用户的菜单树（含按钮）' })
  @ApiResponse({ status: 200, description: '获取成功' })
  @ApiResponse({ status: 401, description: '未授权' })
  getUserMenus(@Request() req) {
    return this.userService.getUserMenus(req.user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('Authorization')
  @ApiOperation({ summary: '获取用户详情' })
  @ApiSuccessResponse(UserDetailVo, { description: '获取成功' })
  @ApiResponse({ status: 404, description: '用户不存在' })
  @ApiResponse({ status: 401, description: '未授权' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('Authorization')
  @ApiOperation({ summary: '完整更新用户信息' })
  @ApiSuccessResponse(UserDetailVo, { description: '更新成功' })
  @ApiResponse({ status: 404, description: '用户不存在' })
  @ApiResponse({ status: 409, description: '用户名或邮箱已存在' })
  @ApiResponse({ status: 401, description: '未授权' })
  replace(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('Authorization')
  @ApiOperation({ summary: '部分更新用户信息' })
  @ApiSuccessResponse(UserDetailVo, { description: '更新成功' })
  @ApiResponse({ status: 404, description: '用户不存在' })
  @ApiResponse({ status: 409, description: '用户名或邮箱已存在' })
  @ApiResponse({ status: 401, description: '未授权' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('Authorization')
  @ApiOperation({ summary: '删除用户' })
  @ApiMessageResponse({ description: '删除成功' })
  @ApiResponse({ status: 404, description: '用户不存在' })
  @ApiResponse({ status: 401, description: '未授权' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }

  @Post(':id/roles')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('Authorization')
  @ApiOperation({ summary: '为用户分配角色' })
  @ApiSuccessResponse(UserDetailVo, { description: '分配成功' })
  @ApiResponse({ status: 404, description: '用户不存在或部分角色不存在' })
  @ApiResponse({ status: 401, description: '未授权' })
  assignRoles(
    @Param('id', ParseIntPipe) id: number,
    @Body() assignRolesDto: AssignRolesDto,
  ) {
    return this.userService.assignRoles(id, assignRolesDto.roleIds);
  }
}
