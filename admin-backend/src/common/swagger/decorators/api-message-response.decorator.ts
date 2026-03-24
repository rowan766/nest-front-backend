import { ApiSuccessResponse } from './api-success-response.decorator';
import { MessageDataDto } from '../dto/message-data.dto';

interface ApiMessageResponseOptions {
  description?: string;
  status?: number;
}

export function ApiMessageResponse(
  options: ApiMessageResponseOptions = {},
) {
  return ApiSuccessResponse(MessageDataDto, options);
}
