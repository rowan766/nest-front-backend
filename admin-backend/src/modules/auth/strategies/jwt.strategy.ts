import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../infrastructure';
import { userDetailSelect } from '../../user/user.select';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'default-secret',
    });
  }

  async validate(payload: any) {
    // payload 是 token 中解析出来的数据
    const user = await this.prisma.user.findUnique({
      where: { id: payload.userId },
      select: userDetailSelect,
    });

    if (!user) {
      throw new UnauthorizedException('用户不存在');
    }

    if (user.status === 0) {
      throw new UnauthorizedException('账号已被禁用');
    }

    // 返回的 user 会被挂载到 request.user 上
    return user;
  }
}
