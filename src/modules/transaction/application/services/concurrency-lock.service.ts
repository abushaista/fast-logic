import { Inject, Injectable } from "@nestjs/common";
import type { RedisCachePort } from "../ports/redis-cache.port";

@Injectable()
export class ConcurencyLockService {
    constructor(
        @Inject('RedisCachePort')
        private readonly redis: RedisCachePort
    ) { }
    async acquireLock(key: string, ttlSeconds: number = 10): Promise<boolean> {
        const existing = await this.redis.get<string>(key);
        if (existing) {
            return false;
        }
        await this.redis.set(key, 'locked', ttlSeconds);
        return true;
    }

    async releaseLock(key: string): Promise<void> {
        await this.redis.delete(key);
    }
}