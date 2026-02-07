import { Module } from '@nestjs/common';
import { OrganizationController } from './api/organization.controller';
import { CardController } from './api/card.controller';
import { OrganizationCommandHandler } from './application/commands/organization/handler/organization-command.handler';
import { CardCommandHandler } from './application/commands/card/handler/card-command.handler';
import { ConcurencyLockService } from './application/services/concurrency-lock.service';
import { IdempotencyService } from './application/services/idempotency.service';
import { OrganizationService } from './application/services/organization.service';
import { CardService } from './application/services/card.service';
import { RedisCacheService } from './infrastructure/redis/redis-idempotency.service';
import { RedisLockService } from './infrastructure/redis/redis-lock.service';
import { RabbitMQPublisher } from './infrastructure/messaging/rabbitmq/rabbitmq.publisher';
import { EventStoreRepository } from './infrastructure/persistence/event-store/event-store.repository';
import { EventMapper } from './infrastructure/persistence/mappers/event.mapper';
import { Pool } from 'pg';
import { RabbitMQConsumer } from './infrastructure/messaging/rabbitmq/rabbitmq.consumer';
import { OrganizationProjection } from './infrastructure/persistence/projections/organization.projection';

@Module({
  controllers: [OrganizationController, CardController,],
  providers: [
    OrganizationCommandHandler,
    CardCommandHandler,
    ConcurencyLockService,
    IdempotencyService,
    OrganizationService,
    CardService,
    {
      provide: 'EventStorePort',
      useFactory: (pool: Pool, mapper: EventMapper) => new EventStoreRepository(pool, mapper),
      inject: [Pool, EventMapper],
    },
    EventMapper,
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
    OrganizationProjection
  ]
})
export class OrganizationModule { }
