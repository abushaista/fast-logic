import Redis from 'ioredis';

export function createRedisClient(): Redis {
    return new Redis({
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
    });
}
