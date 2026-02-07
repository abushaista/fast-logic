import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPositive, IsString, IsUUID } from 'class-validator';
export class CreateTransactionDto {
    @ApiProperty({ description: 'Organization id', example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
    @IsUUID()
    @IsNotEmpty()
    readonly organizationId: string;

    @ApiProperty({ description: 'Card id', example: '6fa85f64-5717-4562-b3fc-2c963f66afa6' })
    @IsUUID()
    @IsNotEmpty()
    readonly cardId: string;

    @ApiProperty({ description: 'Transaction amount', example: 100, minimum: 0 })
    @IsNumber()
    @IsNotEmpty()
    @IsPositive()
    readonly amount: number;

    @ApiProperty({ description: 'Idempotency/transaction key', example: 'tx-key-123' })
    @IsString()
    @IsNotEmpty()
    readonly transactionKey: string;
}