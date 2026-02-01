import { RedisCachePort } from "src/modules/transaction/application/ports/redis-cache.port";
import { redisClient } from './redis.client';

export class RedisCacheService implements RedisCachePort {
  async get<T>(key: string): Promise<T | null> {
    const value = await redisClient.get(key);
    return value ? JSON.parse(value) : null;
  }

  async set<T>(key: string, value: T, ttl?: number) {
    const data = JSON.stringify(value);
    if (ttl) {
      await redisClient.set(key, data, 'EX', ttl);
    } else {
      await redisClient.set(key, data);
    }
  }

  async delete(key: string) {
    await redisClient.del(key);
  }
}
