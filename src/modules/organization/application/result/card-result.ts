export interface CardResult {
    cardId: string;
    status: string;
    message?: string;
    correlationId: string;
    occurredAt: Date;
}