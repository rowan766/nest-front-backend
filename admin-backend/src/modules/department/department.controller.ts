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
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { JwtAuthGuard } from '../auth';
import {
  ApiMessageResponse,
  ApiSuccessArrayResponse,
  ApiSuccessResponse,
} from '../../common';
import {
  DepartmentBaseVo,
  DepartmentDetailVo,
  DepartmentTreeVo,
} from './vo';

@ApiTags('部门管理')
@Controller('department')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('Authorization')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Post()
  @ApiOperation({ summary: '创建部门' })
  @ApiSuccessResponse(DepartmentBaseVo, { status: 201, description: '创建成功' })
  @ApiResponse({ status: 409, description: '部门编码已存在' })
  create(@Body() createDepartmentDto: CreateDepartmentDto) {
    return this.departmentService.create(createDepartmentDto);
  }

  @Get()
  @ApiOperation({ summary: '获取部门列表（树形结构）' })
  @ApiSuccessArrayResponse(DepartmentTreeVo, { description: '获取成功' })
  findAll() {
    return this.departmentService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '获取部门详情' })
  @ApiSuccessResponse(DepartmentDetailVo, { description: '获取成功' })
  @ApiResponse({ status: 404, description: '部门不存在' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.departmentService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: '完整更新部门' })
  @ApiSuccessResponse(DepartmentBaseVo, { description: '更新成功' })
  @ApiResponse({ status: 404, description: '部门不存在' })
  @ApiResponse({ status: 409, description: '部门编码已存在' })
  replace(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDepartmentDto: UpdateDepartmentDto,
  ) {
    return this.departmentService.update(id, updateDepartmentDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: '部分更新部门' })
  @ApiSuccessResponse(DepartmentBaseVo, { description: '更新成功' })
  @ApiResponse({ status: 404, description: '部门不存在' })
  @ApiResponse({ status: 409, description: '部门编码已存在' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDepartmentDto: UpdateDepartmentDto,
  ) {
    return this.departmentService.update(id, updateDepartmentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除部门' })
  @ApiMessageResponse({ description: '删除成功' })
  @ApiResponse({ status: 404, description: '部门不存在' })
  @ApiResponse({ status: 409, description: '该部门下有子部门或用户，无法删除' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.departmentService.remove(id);
  }
}
