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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { DictDataService } from './dict-data.service';
import { CreateDictDataDto } from './dto/create-dict-data.dto';
import { UpdateDictDataDto } from './dto/update-dict-data.dto';
import { QueryDictDataDto } from './dto/query-dict-data.dto';
import { JwtAuthGuard } from '../auth';

@ApiTags('数据字典-数据管理')
@Controller('dict-data')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('Authorization')
export class DictDataController {
  constructor(private readonly dictDataService: DictDataService) {}

  @Post()
  @ApiOperation({ summary: '创建字典数据项' })
  @ApiResponse({ status: 201, description: '创建成功' })
  @ApiResponse({ status: 404, description: '字典类型不存在' })
  @ApiResponse({ status: 401, description: '未授权' })
  create(@Body() createDictDataDto: CreateDictDataDto) {
    return this.dictDataService.create(createDictDataDto);
  }

  @Get()
  @ApiOperation({ summary: '获取字典数据列表' })
  @ApiQuery({ name: 'dictTypeId', description: '字典类型ID（可选）', required: false, type: Number })
  @ApiResponse({ status: 200, description: '获取成功' })
  @ApiResponse({ status: 401, description: '未授权' })
  findAll(@Query() queryDictDataDto: QueryDictDataDto) {
    return this.dictDataService.findAll(queryDictDataDto);
  }

  @Get('type/:code')
  @ApiOperation({ summary: '根据字典类型编码获取数据项列表' })
  @ApiParam({ name: 'code', description: '字典类型编码', example: 'user_gender' })
  @ApiResponse({ status: 200, description: '获取成功' })
  @ApiResponse({ status: 404, description: '字典类型不存在' })
  @ApiResponse({ status: 401, description: '未授权' })
  findByTypeCode(@Param('code') code: string) {
    return this.dictDataService.findByTypeCode(code);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取字典数据详情' })
  @ApiResponse({ status: 200, description: '获取成功' })
  @ApiResponse({ status: 404, description: '字典数据不存在' })
  @ApiResponse({ status: 401, description: '未授权' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.dictDataService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: '完整更新字典数据项' })
  @ApiResponse({ status: 200, description: '更新成功' })
  @ApiResponse({ status: 404, description: '字典数据不存在或字典类型不存在' })
  @ApiResponse({ status: 401, description: '未授权' })
  replace(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDictDataDto: UpdateDictDataDto,
  ) {
    return this.dictDataService.update(id, updateDictDataDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: '部分更新字典数据项' })
  @ApiResponse({ status: 200, description: '更新成功' })
  @ApiResponse({ status: 404, description: '字典数据不存在或字典类型不存在' })
  @ApiResponse({ status: 401, description: '未授权' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDictDataDto: UpdateDictDataDto,
  ) {
    return this.dictDataService.update(id, updateDictDataDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除字典数据项' })
  @ApiResponse({ status: 200, description: '删除成功' })
  @ApiResponse({ status: 404, description: '字典数据不存在' })
  @ApiResponse({ status: 401, description: '未授权' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.dictDataService.remove(id);
  }
}
