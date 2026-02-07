import { ApiProperty } from '@nestjs/swagger';

export class UpdateBalanceDto {
    @ApiProperty({ description: 'Organization ID', example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
    readonly OrganizationId: string;

    @ApiProperty({ description: 'New balance amount', example: 5000, minimum: 0 })
    readonly balance: number;

    @ApiProperty({ description: 'Transaction key for idempotency', example: 'tx-key-456' })
    readonly transactionKey: string;
}