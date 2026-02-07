import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Controller, Post, Req, Body, Get, Param, Inject } from '@nestjs/common';
import { TransactionResponseDto } from './dto/transaction-response.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { ProcessTransactionHandler } from '../application/commands/handlers/process-transaction.handler';
import { GetTransactionStatusHandler } from '../application/queries/handlers/get-transaction-status.handler';
import { ProcessTransactionCommand } from '../application/commands/process-transaction.command';
import { UuidUtil } from 'src/shared/utils/uuid.util';
import { Money } from '../domain/value-objects/money.vo';
import { GetTransactionStatusQuery } from '../application/queries/get-transaction-status.query';
import { log } from 'console';

@ApiTags('transaction')
@Controller('transaction')
export class TransactionController {

    constructor(
        @Inject()
        private readonly commandHandler: ProcessTransactionHandler,
        @Inject()
        private readonly queryHandler: GetTransactionStatusHandler,
    ) { }

    @Post()
    @ApiOperation({ summary: 'Create a new transaction' })
    @ApiBody({ type: CreateTransactionDto })
    @ApiResponse({ status: 201, description: 'Transaction processed', type: TransactionResponseDto })
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
        try {
            const result = this.commandHandler.execute(command);
            return result;
        } catch (error) {
            console.log(error);
            throw error;
        }

    }

    @Get(':transactionId')
    @ApiOperation({ summary: 'Get transaction status by id' })
    @ApiResponse({ status: 200, description: 'Transaction status', type: TransactionResponseDto })
    @ApiResponse({ status: 404, description: 'Transaction not found' })
    getTransaction(@Param('transactionId') transactionId: string, @Req() req: any) {
        console.log(transactionId);
        try {
            return this.queryHandler.execute(new GetTransactionStatusQuery(transactionId));
        } catch (error) {
            console.log(error)
        }

    }
}


