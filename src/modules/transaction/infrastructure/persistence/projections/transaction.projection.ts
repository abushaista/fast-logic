import { Pool } from "pg";
import { TransactionApprovedEvent } from "src/modules/transaction/domain/events/transaction-approved.event";
import { TransactionCreatedEvent } from "src/modules/transaction/domain/events/transaction-created.event";

export class TransactionProjection {
    constructor(private readonly pool: Pool) {
    }

    async project(event: TransactionCreatedEvent) {
        await this.pool.query(
            `
            INSERT INTO transaction_read (transaction_id, cardId, amount, status, updated_at)
            VALUES ($1, $2, $3, $4, now())
            ON CONFLICT (transaction_id)
            DO UPDATE SET status = $4, updated_at = now()
            `,
            [event.metadata.aggregateId, event.payload.cardId, event.payload.amount, event.payload.status],
        );
    }

    async projectUpdate(event: TransactionApprovedEvent) {
        await this.pool.query(
            `UPDATE transaction_read SET status = $1, updated_at = now()
            WHERE transaction_id = $2
            `
            [event.payload.status, event.metadata.aggregateId]
        );
    }
}