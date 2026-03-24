import { Type } from '@nestjs/common';
import { ApiSuccessResponse } from './api-success-response.decorator';

interface ApiSuccessArrayResponseOptions {
  description?: string;
  status?: number;
}

export function ApiSuccessArrayResponse<TModel extends Type<unknown>>(
  model: TModel,
  options: ApiSuccessArrayResponseOptions = {},
) {
  return ApiSuccessResponse(model, {
    ...options,
    isArray: true,
  });
}
