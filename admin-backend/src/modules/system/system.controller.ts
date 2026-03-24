import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RedisService } from '../../infrastructure';

@ApiTags('开发调试')
@Controller('redis')
export class SystemController {
  constructor(private readonly redisService: RedisService) {}

  @Get('test')
  async testRedis() {
    const testKey = 'test:key';
    const testValue = { message: 'Hello Redis!', timestamp: Date.now() };

    await this.redisService.set(testKey, testValue, 60000);

    const retrievedValue = await this.redisService.get(testKey);

    return {
      success: true,
      data: {
        stored: testValue,
        retrieved: retrievedValue,
        match: JSON.stringify(testValue) === JSON.stringify(retrievedValue),
      },
    };
  }

  @Get('set')
  async setCache(@Query('key') key: string, @Query('value') value: string) {
    if (!key || !value) {
      return {
        success: false,
        message: '请提供 key 和 value 参数',
        data: null,
      };
    }

    await this.redisService.set(key, value, 60000);

    return {
      success: true,
      message: '缓存设置成功',
      data: { key, value },
    };
  }

  @Get('get')
  async getCache(@Query('key') key: string) {
    if (!key) {
      return {
        success: false,
        message: '请提供 key 参数',
        data: null,
      };
    }

    const value = await this.redisService.get(key);

    return {
      success: true,
      data: { key, value },
    };
  }

  @Get('del')
  async delCache(@Query('key') key: string) {
    if (!key) {
      return {
        success: false,
        message: '请提供 key 参数',
        data: null,
      };
    }

    await this.redisService.del(key);

    return {
      success: true,
      message: '缓存删除成功',
      data: { key },
    };
  }
}
