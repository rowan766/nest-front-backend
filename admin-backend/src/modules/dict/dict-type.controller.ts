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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { DictTypeService } from './dict-type.service';
import { CreateDictTypeDto } from './dto/create-dict-type.dto';
import { UpdateDictTypeDto } from './dto/update-dict-type.dto';
import { QueryDictTypeDto } from './dto/query-dict-type.dto';
import { JwtAuthGuard } from '../auth';

@ApiTags('数据字典-类型管理')
@Controller('dict-type')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('Authorization')
export class DictTypeController {
  constructor(private readonly dictTypeService: DictTypeService) {}

  @Post()
  @ApiOperation({ summary: '创建字典类型' })
  @ApiResponse({ status: 201, description: '创建成功' })
  @ApiResponse({ status: 409, description: '字典编码已存在' })
  @ApiResponse({ status: 401, description: '未授权' })
  create(@Body() createDictTypeDto: CreateDictTypeDto) {
    return this.dictTypeService.create(createDictTypeDto);
  }

  @Get()
  @ApiOperation({ summary: '获取字典类型列表（含数据项）' })
  @ApiResponse({ status: 200, description: '获取成功' })
  @ApiResponse({ status: 401, description: '未授权' })
  findAll(@Query() queryDictTypeDto: QueryDictTypeDto) {
    return this.dictTypeService.findAll(queryDictTypeDto);
  }

  @Get('code/:code')
  @ApiOperation({ summary: '根据字典编码获取字典类型及数据项' })
  @ApiParam({ name: 'code', description: '字典编码', example: 'user_gender' })
  @ApiResponse({ status: 200, description: '获取成功' })
  @ApiResponse({ status: 404, description: '字典类型不存在' })
  @ApiResponse({ status: 401, description: '未授权' })
  findByCode(@Param('code') code: string) {
    return this.dictTypeService.findByCode(code);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取字典类型详情' })
  @ApiResponse({ status: 200, description: '获取成功' })
  @ApiResponse({ status: 404, description: '字典类型不存在' })
  @ApiResponse({ status: 401, description: '未授权' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.dictTypeService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: '完整更新字典类型' })
  @ApiResponse({ status: 200, description: '更新成功' })
  @ApiResponse({ status: 404, description: '字典类型不存在' })
  @ApiResponse({ status: 409, description: '字典编码已存在' })
  @ApiResponse({ status: 401, description: '未授权' })
  replace(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDictTypeDto: UpdateDictTypeDto,
  ) {
    return this.dictTypeService.update(id, updateDictTypeDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: '部分更新字典类型' })
  @ApiResponse({ status: 200, description: '更新成功' })
  @ApiResponse({ status: 404, description: '字典类型不存在' })
  @ApiResponse({ status: 409, description: '字典编码已存在' })
  @ApiResponse({ status: 401, description: '未授权' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDictTypeDto: UpdateDictTypeDto,
  ) {
    return this.dictTypeService.update(id, updateDictTypeDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除字典类型' })
  @ApiResponse({ status: 200, description: '删除成功' })
  @ApiResponse({ status: 404, description: '字典类型不存在' })
  @ApiResponse({ status: 409, description: '该字典类型下有数据项，无法删除' })
  @ApiResponse({ status: 401, description: '未授权' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.dictTypeService.remove(id);
  }
}
