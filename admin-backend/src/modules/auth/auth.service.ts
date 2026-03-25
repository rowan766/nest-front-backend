import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService, RedisService } from '../../infrastructure';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private redisService: RedisService,
  ) {}

  async createCaptcha() {
    const captchaId = randomUUID();
    const captchaCode = this.generateCaptchaCode();
    const captchaSvg = this.buildCaptchaSvg(captchaCode);

    await this.redisService.setWithPrefix('captcha', captchaId, captchaCode, 5 * 60 * 1000);

    return {
      captchaId,
      captchaSvg,
      expiresIn: 300,
    };
  }

  // 登录
  async login(loginDto: LoginDto) {
    const cachedCaptcha = await this.redisService.getWithPrefix<string>('captcha', loginDto.captchaId);

    if (!cachedCaptcha) {
      throw new UnauthorizedException('验证码已过期，请刷新后重试');
    }

    await this.redisService.delWithPrefix('captcha', loginDto.captchaId);

    if (cachedCaptcha.toLowerCase() !== loginDto.captchaCode.trim().toLowerCase()) {
      throw new UnauthorizedException('验证码错误');
    }

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

  private generateCaptchaCode(length = 4): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  }

  private buildCaptchaSvg(code: string): string {
    const width = 132;
    const height = 44;
    const background = ['#f3f7ff', '#eefbf3', '#fff6ea', '#f8f1ff'][
      Math.floor(Math.random() * 4)
    ];

    const chars = code
      .split('')
      .map((char, index) => {
        const x = 18 + index * 26;
        const y = 28 + Math.floor(Math.random() * 6);
        const rotate = Math.floor(Math.random() * 30) - 15;
        const color = ['#2563eb', '#059669', '#dc2626', '#7c3aed', '#ea580c'][
          Math.floor(Math.random() * 5)
        ];

        return `<text x="${x}" y="${y}" font-size="24" font-family="Arial" font-weight="700" fill="${color}" transform="rotate(${rotate} ${x} ${y})">${char}</text>`;
      })
      .join('');

    const noiseLines = Array.from({ length: 4 }, () => {
      const x1 = Math.floor(Math.random() * width);
      const y1 = Math.floor(Math.random() * height);
      const x2 = Math.floor(Math.random() * width);
      const y2 = Math.floor(Math.random() * height);
      const stroke = ['#93c5fd', '#86efac', '#fca5a5', '#c4b5fd'][
        Math.floor(Math.random() * 4)
      ];

      return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="1.5" />`;
    }).join('');

    const noiseDots = Array.from({ length: 18 }, () => {
      const cx = Math.floor(Math.random() * width);
      const cy = Math.floor(Math.random() * height);
      const fill = ['#bfdbfe', '#bbf7d0', '#fed7aa', '#ddd6fe'][
        Math.floor(Math.random() * 4)
      ];

      return `<circle cx="${cx}" cy="${cy}" r="1.2" fill="${fill}" />`;
    }).join('');

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="100%" height="100%" rx="8" fill="${background}" />${noiseLines}${noiseDots}${chars}</svg>`;
  }
}
