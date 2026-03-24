import { ApiProperty } from '@nestjs/swagger';

export class MessageDataDto {
  @ApiProperty({ description: '返回消息', example: '删除成功' })
  message: string;
}
