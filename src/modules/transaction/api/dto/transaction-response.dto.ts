import { ApiProperty } from '@nestjs/swagger';

export class TransactionResponseDto {
    @ApiProperty({ description: 'Transaction id', example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
    transactionId: string;

    @ApiProperty({ description: 'Transaction status', example: 'PENDING' })
    status: string;

    @ApiProperty({ description: 'Correlation id', example: 'corr-123', required: false })
    correlationId?: string;

    @ApiProperty({ description: 'Timestamp when the response occurred', example: new Date().toISOString(), required: false })
    occurredAt?: string;

    constructor(partial: Partial<TransactionResponseDto>) {
        Object.assign(this, partial);
    }
}