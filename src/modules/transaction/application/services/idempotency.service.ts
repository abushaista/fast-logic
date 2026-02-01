import { RedisCachePort } from "../ports/redis-cache.port";

export class IdempotencyService {
    constructor(private readonly redis: RedisCachePort)
    {}
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
}