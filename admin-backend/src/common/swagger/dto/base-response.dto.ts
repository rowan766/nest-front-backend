import { ApiProperty } from '@nestjs/swagger';

export class BaseResponseDto {
  @ApiProperty({ description: '业务状态码', example: 200 })
  code: number;

  @ApiProperty({ description: '响应消息', example: '请求成功' })
  message: string;

  @ApiProperty({
    description: '响应时间',
    example: '2026-03-22T06:30:00.000Z',
  })
  timestamp: string;

  @ApiProperty({ description: '请求路径', example: '/department' })
  path: string;
}
