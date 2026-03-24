import { Module } from '@nestjs/common';
import { RedisModule } from '../../infrastructure';
import { SystemController } from './system.controller';

@Module({
  imports: [RedisModule],
  controllers: [SystemController],
})
export class SystemModule {}
