import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Controller, Post, Req, Body, Get, Param } from '@nestjs/common';
import { TransactionResponseDto } from './dto/transaction-response.dto';

@Controller('transaction')
export class TransactionController {

    @Post()
    createTransaction(@Body() dto: CreateTransactionDto,
    @Req() req: any,){
        
        return new TransactionResponseDto({
            transactionId: 'tx123',
            status: 'PENDING',
            correlationId: req.correlationId,
            occurredAt: new Date().toISOString(),
        });
    }

    @Get(':id')
    getTransaction(@Param('transactionId') transactionId: string, @Req() req: any) {
        return new TransactionResponseDto({
            transactionId: transactionId,
            status: 'COMPLETED',
            correlationId: req.correlationId,
            occurredAt: new Date().toISOString(),
        });
    }
}


