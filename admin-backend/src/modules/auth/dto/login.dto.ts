import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ description: '用户名', example: 'admin' })
  @IsString()
  username: string;

  @ApiProperty({ description: '密码', example: '123456' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ description: '验证码ID', example: 'captcha_xxx' })
  @IsString()
  captchaId: string;

  @ApiProperty({ description: '验证码', example: 'ABCD' })
  @IsString()
  @MinLength(4)
  captchaCode: string;
}
