export class TransactionResponseDto {
    transactionId: string;
    status: string;
    correlationId?: string;
    occurredAt?: string;
    constructor(partial: Partial<TransactionResponseDto>) {
        Object.assign(this, partial);
    }
}