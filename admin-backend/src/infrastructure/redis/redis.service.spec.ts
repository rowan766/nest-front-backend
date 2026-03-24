import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Test, TestingModule } from '@nestjs/testing';
import { RedisService } from './redis.service';
import type { Cache } from 'cache-manager';

describe('RedisService', () => {
  let service: RedisService;
  let cacheManager: jest.Mocked<Cache>;

  beforeEach(async () => {
    cacheManager = {
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
    } as unknown as jest.Mocked<Cache>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RedisService,
        {
          provide: CACHE_MANAGER,
          useValue: cacheManager,
        },
      ],
    }).compile();

    service = module.get<RedisService>(RedisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should set cache value with prefix', async () => {
    await service.setWithPrefix('user', '1', { id: 1 });

    expect(cacheManager.set).toHaveBeenCalledWith('user:1', { id: 1 }, undefined);
  });

  it('should return true when cache key exists', async () => {
    cacheManager.get.mockResolvedValueOnce('value');

    await expect(service.has('token')).resolves.toBe(true);
  });
});
