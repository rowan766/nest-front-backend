import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @ApiProperty({ description: '旧密码', example: '123456' })
  @IsString()
  oldPassword: string;

  @ApiProperty({ description: '新密码', example: '654321' })
  @IsString()
  @MinLength(6)
  newPassword: string;
}