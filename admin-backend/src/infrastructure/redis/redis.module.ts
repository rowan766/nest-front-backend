import { Module, Logger } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-yet';
import { RedisService } from './redis.service';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const logger = new Logger('RedisModule');
        const redisEnabled = configService.get<boolean>('REDIS_ENABLED', true);

        if (!redisEnabled) {
          logger.warn('Redis is disabled. Using in-memory cache instead.');
          return {
            ttl: configService.get<number>('REDIS_TTL', 60 * 60 * 1000),
          };
        }

        try {
          logger.log('Attempting to connect to Redis...');
          const store = await redisStore({
            socket: {
              host: configService.get<string>('REDIS_HOST', 'localhost'),
              port: configService.get<number>('REDIS_PORT', 6379),
              connectTimeout: 5000, // 5秒连接超时
            },
            password: configService.get<string>('REDIS_PASSWORD'),
            database: configService.get<number>('REDIS_DB', 0),
          });
          logger.log('Successfully connected to Redis!');
          return {
            store,
            ttl: configService.get<number>('REDIS_TTL', 60 * 60 * 1000),
          };
        } catch (error) {
          logger.error('Redis Connection Error: ', error);
          logger.warn(
            'Failed to connect to Redis. Falling back to in-memory cache.',
          );
          logger.warn(
            'Please ensure Redis is installed and running, or set REDIS_ENABLED=false in .env',
          );
          // 返回内存缓存配置作为降级方案
          return {
            ttl: configService.get<number>('REDIS_TTL', 60 * 60 * 1000),
          };
        }
      },
    }),
  ],
  providers: [RedisService],
  exports: [RedisService, CacheModule],
})
export class RedisModule {}
