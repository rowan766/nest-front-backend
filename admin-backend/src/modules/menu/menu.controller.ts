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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { JwtAuthGuard } from '../auth';

@ApiTags('菜单管理')
@Controller('menu')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('Authorization')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  @ApiOperation({ summary: '创建菜单' })
  @ApiResponse({ status: 201, description: '创建成功' })
  @ApiResponse({ status: 404, description: '父菜单不存在' })
  @ApiResponse({ status: 409, description: '菜单类型必须提供路由路径或按钮类型必须提供权限标识' })
  @ApiResponse({ status: 401, description: '未授权' })
  create(@Body() createMenuDto: CreateMenuDto) {
    return this.menuService.create(createMenuDto);
  }

  @Get()
  @ApiOperation({ summary: '获取菜单列表（树形结构）' })
  @ApiResponse({ status: 200, description: '获取成功' })
  @ApiResponse({ status: 401, description: '未授权' })
  findAll() {
    return this.menuService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '获取菜单详情' })
  @ApiResponse({ status: 200, description: '获取成功' })
  @ApiResponse({ status: 404, description: '菜单不存在' })
  @ApiResponse({ status: 401, description: '未授权' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.menuService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: '完整更新菜单' })
  @ApiResponse({ status: 200, description: '更新成功' })
  @ApiResponse({ status: 404, description: '菜单不存在或父菜单不存在' })
  @ApiResponse({ status: 409, description: '不能将自己设置为父菜单' })
  @ApiResponse({ status: 401, description: '未授权' })
  replace(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMenuDto: UpdateMenuDto,
  ) {
    return this.menuService.update(id, updateMenuDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: '部分更新菜单' })
  @ApiResponse({ status: 200, description: '更新成功' })
  @ApiResponse({ status: 404, description: '菜单不存在或父菜单不存在' })
  @ApiResponse({ status: 409, description: '不能将自己设置为父菜单' })
  @ApiResponse({ status: 401, description: '未授权' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMenuDto: UpdateMenuDto,
  ) {
    return this.menuService.update(id, updateMenuDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除菜单' })
  @ApiResponse({ status: 200, description: '删除成功' })
  @ApiResponse({ status: 404, description: '菜单不存在' })
  @ApiResponse({ status: 409, description: '该菜单下有子菜单或按钮，或该菜单已分配给角色，无法删除' })
  @ApiResponse({ status: 401, description: '未授权' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.menuService.remove(id);
  }
}
