import { RedisCachePort } from "src/modules/transaction/application/ports/redis-cache.port";
import Redis from "ioredis";
import { Inject, Injectable } from "@nestjs/common";
import { REDIS_CLIENT } from "./redis.client";

@Injectable()
export class RedisCacheService implements RedisCachePort {
  constructor(
    @Inject(REDIS_CLIENT)
    private readonly redisClient: Redis
  ) { }
  async get<T>(key: string): Promise<T | null> {
    const value = await this.redisClient.get(key);
    return value ? JSON.parse(value) : null;
  }

  async set<T>(key: string, value: T, ttl?: number) {
    const data = JSON.stringify(value);
    if (ttl) {
      await this.redisClient.set(key, data, 'EX', ttl);
    } else {
      await this.redisClient.set(key, data);
    }
  }

  async delete(key: string) {
    await this.redisClient.del(key);
  }
}
