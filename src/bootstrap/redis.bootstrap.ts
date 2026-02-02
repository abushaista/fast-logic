import Redis from 'ioredis';

export function createRedisClient(): Redis {
    const port = parseInt(process.env.REDIS_PORT ?? '6379', 10);
    return new Redis({
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: port,
        password: process.env.REDIS_PASSWORD || '9gT?!dvXq53JekhWDk!LwwDWsXv5ClPD',
    });
}
