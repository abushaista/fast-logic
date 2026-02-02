import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Controller, Post, Req, Body, Get, Param } from '@nestjs/common';
import { TransactionResponseDto } from './dto/transaction-response.dto';
import { ProcessTransactionHandler } from '../application/commands/handlers/process-transaction.handler';
import { GetTransactionStatusHandler } from '../application/queries/handlers/get-transaction-status.handler';
import { ProcessTransactionCommand } from '../application/commands/process-transaction.command';
import { UuidUtil } from 'src/shared/utils/uuid.util';
import { Money } from '../domain/value-objects/money.vo';
import { GetTransactionStatusQuery } from '../application/queries/get-transaction-status.query';

@Controller('transaction')
export class TransactionController {

    constructor(
        private readonly commandHandler: ProcessTransactionHandler,
        private readonly queryHandler: GetTransactionStatusHandler,
    ) { }

    @Post()
    createTransaction(@Body() dto: CreateTransactionDto,
        @Req() req: any,) {
        const command: ProcessTransactionCommand = new ProcessTransactionCommand(
            UuidUtil.generate(),
            dto.organizationId,
            dto.cardId,
            new Money({ amount: dto.amount, currency: 'USD' }),
            dto.transactionKey,
            req.correlationId,
        );
        const result = this.commandHandler.execute(command);
        return result;
    }

    @Get(':id')
    getTransaction(@Param('transactionId') transactionId: string, @Req() req: any) {
        return this.queryHandler.execute(new GetTransactionStatusQuery(transactionId));
    }
}


