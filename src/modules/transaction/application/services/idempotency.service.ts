import { Inject, Injectable } from "@nestjs/common";
import type { RedisCachePort } from "../ports/redis-cache.port";

@Injectable()
export class IdempotencyService {
    constructor(
        @Inject('RedisCachePort')
        private readonly redis: RedisCachePort) { }
    async getTransactionId(key: string): Promise<string | null> {
        return this.redis.get<string>(key);
    }

    async save(
        key: string,
        transactionId: string,
        ttlSeconds: number,
    ): Promise<void> {
        await this.redis.set(key, transactionId, ttlSeconds);
    }

    async remove(key: string): Promise<void> {
        await this.redis.delete(key);
    }
}