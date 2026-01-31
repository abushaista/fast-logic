import { Module } from '@nestjs/common';
import { TransactionController } from './api/transaction.controller';

@Module({
  controllers: [TransactionController]
})
export class TransactionModule {}
