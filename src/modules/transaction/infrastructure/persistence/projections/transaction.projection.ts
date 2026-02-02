import { Pool } from "pg";
import { TransactionApprovedEvent } from "src/modules/transaction/domain/events/transaction-approved.event";

export class TransactionProjection {
    constructor(private readonly pool: Pool){
    }

    async project(event: TransactionApprovedEvent) {
        await this.pool.query(
            `
            INSERT INTO transaction_read (transaction_id, status, updated_at)
            VALUES ($1, $2, now())
            ON CONFLICT (transaction_id)
            DO UPDATE SET status = $2, updated_at = now()
            `,
            [event.metadata.aggregateId, 'APPROVED'],
        );
    }
}