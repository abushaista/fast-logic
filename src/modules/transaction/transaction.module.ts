import { Module } from '@nestjs/common';
import { Pool } from 'pg'

import { TransactionController } from './api/transaction.controller';

import { ProcessTransactionHandler } from './application/commands/handlers/process-transaction.handler';
import { GetTransactionStatusHandler } from './application/queries/handlers/get-transaction-status.handler';
import { ConcurencyLockService } from './application/services/concurrency-lock.service';
import { IdempotencyService } from './application/services/idempotency.service';
import { TransactionService } from './application/services/transaction.service';

import { EventStoreRepository } from './infrastructure/persistence/event-store/event-store.repository';

@Module({
  controllers: [TransactionController]
})
export class TransactionModule {}
