import { Inject, Injectable } from '@nestjs/common';
import type { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  /**
   * 设置缓存
   * @param key 键
   * @param value 值
   * @param ttl 过期时间（毫秒）
   */
  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    await this.cacheManager.set(key, value, ttl);
  }

  /**
   * 获取缓存
   * @param key 键
   */
  async get<T>(key: string): Promise<T | undefined> {
    return await this.cacheManager.get<T>(key);
  }

  /**
   * 删除缓存
   * @param key 键
   */
  async del(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }

  /**
   * 检查键是否存在
   * @param key 键
   */
  async has(key: string): Promise<boolean> {
    const value = await this.get(key);
    return value !== undefined && value !== null;
  }

  /**
   * 设置带前缀的缓存键
   * @param prefix 前缀
   * @param key 键
   * @param value 值
   * @param ttl 过期时间（毫秒）
   */
  async setWithPrefix(
    prefix: string,
    key: string,
    value: unknown,
    ttl?: number,
  ): Promise<void> {
    await this.set(this.buildKey(prefix, key), value, ttl);
  }

  /**
   * 获取带前缀的缓存
   * @param prefix 前缀
   * @param key 键
   */
  async getWithPrefix<T>(prefix: string, key: string): Promise<T | undefined> {
    return await this.get<T>(this.buildKey(prefix, key));
  }

  /**
   * 删除带前缀的缓存
   * @param prefix 前缀
   * @param key 键
   */
  async delWithPrefix(prefix: string, key: string): Promise<void> {
    await this.del(this.buildKey(prefix, key));
  }

  private buildKey(prefix: string, key: string): string {
    return `${prefix}:${key}`;
  }
}
