import { Module } from '@nestjs/common';
import { Pool } from 'pg'

import { TransactionController } from './api/transaction.controller';

import { ProcessTransactionHandler } from './application/commands/handlers/process-transaction.handler';
import { GetTransactionStatusHandler } from './application/queries/handlers/get-transaction-status.handler';
import { ConcurencyLockService } from './application/services/concurrency-lock.service';
import { IdempotencyService } from './application/services/idempotency.service';
import { TransactionService } from './application/services/transaction.service';

import { EventStoreRepository } from './infrastructure/persistence/event-store/event-store.repository';
import { BalanceProjection } from './infrastructure/persistence/projections/balance.projection';
import { RedisCacheService } from './infrastructure/cache/redis/redis-idempotency.service';
import { RedisLockService } from './infrastructure/cache/redis/redis-lock.service';
import { RabbitMQPublisher } from './infrastructure/messaging/rabbitmq/rabbitmq.publisher';
import { TransactionReadRepository } from './infrastructure/persistence/read-model/transaction-read.repository';

import { createPostgresPool } from 'src/bootstrap/database.bootstrap';
import { createRedisClient } from 'src/bootstrap/redis.bootstrap';
import { createRabbitMQChannel } from 'src/bootstrap/rabbitmq.bootstrap';
import { RabbitMQConsumer } from './infrastructure/messaging/rabbitmq/rabbitmq.consumer';


@Module({
  controllers: [TransactionController],
  providers: [
    {
      provide: Pool,
      useFactory: createPostgresPool
    },
    {
      provide: 'REDIS_CLIENT',
      useFactory: createRedisClient,
    },
    {
      provide: 'RABITMQ_CHANNEL',
      useFactory: createRabbitMQChannel
    },
    ProcessTransactionHandler,
    GetTransactionStatusHandler,
    ConcurencyLockService,
    IdempotencyService,
    TransactionService,
    {
      provide: 'EventStorePort',
      useClass: EventStoreRepository
    },
    {
      provide: 'TransactionReadPort',
      useClass: TransactionReadRepository
    },
    {
      provide: 'RedisCachePort',
      useClass: RedisCacheService,
    },
    {
      provide: 'ConcurrencyLockPort',
      useClass: RedisLockService,
    },
    {
      provide: 'EventBusPort',
      useClass: RabbitMQPublisher,
    },
    RabbitMQConsumer,
    BalanceProjection,
  ]
})
export class TransactionModule { }
