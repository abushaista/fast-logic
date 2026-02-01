export interface TransactionReadPort {
  getStatus(transactionId: string): Promise<{
    transactionId: string;
    status: string;
    updatedAt: Date;
  } | null>;
}