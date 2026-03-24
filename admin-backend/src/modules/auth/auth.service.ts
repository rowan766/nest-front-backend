import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../infrastructure';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // 登录
  async login(loginDto: LoginDto) {
    // 1. 查找用户
    const user = await this.prisma.user.findUnique({
      where: { username: loginDto.username },
    });

    if (!user) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    // 2. 验证密码
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    // 3. 检查用户状态
    if (user.status === 0) {
      throw new UnauthorizedException('账号已被禁用');
    }

    // 4. 生成 JWT token
    const payload = {
      userId: user.id,
      username: user.username,
    };

    const token = this.jwtService.sign(payload);

    // 5. 返回用户信息和 token
    return {
      access_token: token,
      user: {
        id: user.id,
        username: user.username,
        nickname: user.nickname,
        email: user.email,
        avatar: user.avatar,
      },
    };
  }

    // 登出（简单版本，主要由前端清除 token）
    async logout() {
    // 这里可以记录登出日志
    // 或者清除 refresh token（如果有的话）
    return {
        message: '登出成功',
        };
    }
}
