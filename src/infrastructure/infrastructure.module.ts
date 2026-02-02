import { Global, Module } from '@nestjs/common';
import { createRabbitMQChannel } from 'src/bootstrap/rabbitmq.bootstrap';
import { createRedisClient } from 'src/bootstrap/redis.bootstrap';
import { createPostgresPool } from 'src/bootstrap/database.bootstrap';
import { Pool } from 'pg';

@Global()
@Module({
    providers: [
        {
            provide: Pool,
            useFactory: createPostgresPool,
        },
        {
            provide: 'REDIS_CLIENT',
            useFactory: createRedisClient,
        },
        {
            provide: 'RABBITMQ_CHANNEL',
            useFactory: createRabbitMQChannel,
        },
    ],
    exports: [
        Pool,
        'REDIS_CLIENT',
        'RABBITMQ_CHANNEL',
    ],
})
export class InfrastructureModule { }
