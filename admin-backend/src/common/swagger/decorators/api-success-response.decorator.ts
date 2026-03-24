import { Type, applyDecorators } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';

interface ApiSuccessResponseOptions {
  description?: string;
  status?: number;
  isArray?: boolean;
}

export function ApiSuccessResponse<TModel extends Type<unknown>>(
  model: TModel,
  options: ApiSuccessResponseOptions = {},
) {
  const {
    description = '请求成功',
    status = 200,
    isArray = false,
  } = options;

  return applyDecorators(
    ApiExtraModels(model),
    ApiResponse({
      status,
      description,
      schema: {
        type: 'object',
        properties: {
          code: {
            type: 'number',
            description: '业务状态码',
            example: 200,
          },
          message: {
            type: 'string',
            description: '响应消息',
            example: '请求成功',
          },
          timestamp: {
            type: 'string',
            description: '响应时间',
            example: '2026-03-22T06:30:00.000Z',
          },
          path: {
            type: 'string',
            description: '请求路径',
            example: '/department',
          },
          data: isArray
            ? {
                type: 'array',
                items: {
                  $ref: getSchemaPath(model),
                },
              }
            : {
                $ref: getSchemaPath(model),
              },
        },
        required: ['code', 'message', 'timestamp', 'path', 'data'],
      },
    }),
  );
}
