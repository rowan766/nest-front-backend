import { Type } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from './base-response.dto';

const responseDtoCache = new Map<string, Type<unknown>>();

function buildCacheKey(modelName: string, isArray: boolean) {
  return `${modelName}:${isArray ? 'array' : 'single'}`;
}

export function createSuccessResponseDto<TModel extends Type<unknown>>(
  model: TModel,
  isArray = false,
) {
  const cacheKey = buildCacheKey(model.name, isArray);
  const cached = responseDtoCache.get(cacheKey);

  if (cached) {
    return cached;
  }

  class SuccessResponseDto extends BaseResponseDto {
    @ApiProperty({
      description: '响应数据',
      type: isArray ? [model] : model,
    })
    data: unknown;
  }

  Object.defineProperty(SuccessResponseDto, 'name', {
    value: `${model.name}${isArray ? 'Array' : ''}SuccessResponseDto`,
  });

  responseDtoCache.set(cacheKey, SuccessResponseDto);
  return SuccessResponseDto;
}
