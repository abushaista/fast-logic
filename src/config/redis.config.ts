import { registerAs } from '@nestjs/config';

export default registerAs('redis', () => ({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD,

  keyPrefix: 'transaction:',

  ttl: {
    idempotency: 60 * 60, // 1 hour
    lock: 10,             // seconds
    snapshot: 60 * 60 * 24, // 1 day
  },
}));
