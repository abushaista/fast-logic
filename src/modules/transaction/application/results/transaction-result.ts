export interface TransactionResult {
  transactionId: string;
  status: string;
  message?: string;
  occurredAt: Date;
}
