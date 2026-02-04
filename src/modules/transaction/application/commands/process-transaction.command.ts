import { Money } from "../../domain/value-objects/money.vo";

export class ProcessTransactionCommand {
  constructor(
    public transactionId: string,
    public readonly organizationId: string,
    public readonly cardId: string,
    public readonly amount: Money,
    public readonly idempotencyKey: string,
    public readonly correlationId?: string,
  ) { }
}