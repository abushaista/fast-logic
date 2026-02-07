import { Injectable } from "@nestjs/common";
import { Pool } from "pg";
import { TransactionApprovedEvent } from "src/modules/transaction/domain/events/transaction-approved.event";
import { TransactionCreatedEvent } from "src/modules/transaction/domain/events/transaction-created.event";

@Injectable()
export class TransactionProjection {
    constructor(private readonly pool: Pool) {
    }

    async project(event: TransactionCreatedEvent) {
        await this.pool.query(
            `
            INSERT INTO transaction_read (transaction_id, cardId, amount, status, version, updated_at)
            VALUES ($1, $2, $3, $4, $5, now())
            ON CONFLICT (transaction_id)
            DO UPDATE SET status = $4, updated_at = now(), version = $5
            `,
            [event.metadata.aggregateId, event.payload.cardId, event.payload.amount, event.payload.status, event.metadata.version],
        );
    }

    async projectUpdate(event: TransactionApprovedEvent) {
        await this.pool.query(
            `UPDATE transaction_read SET status = $1, updated_at = now(), version = $2
            WHERE transaction_id = $3
            `
            [event.payload.status, event.metadata.version, event.metadata.aggregateId]
        );
    }
}