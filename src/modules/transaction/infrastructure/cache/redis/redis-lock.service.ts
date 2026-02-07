import { Inject, Injectable } from "@nestjs/common";
import Redis from "ioredis";
import { REDIS_CLIENT } from "./redis.client";

@Injectable()
export class RedisLockService {
  constructor(
    @Inject(REDIS_CLIENT)
    private readonly redisClient: Redis) {
  }
  async acquire(key: string, ttlSeconds: number): Promise<boolean> {
    const result = await this.redisClient.call('SET', key, '1', 'NX', 'EX', ttlSeconds.toString());

    return result === 'OK';
  }

  async release(key: string): Promise<void> {
    await this.redisClient.del(key);
  }
}
