import { Pool } from "pg";
import { BalanceDeductedEvent } from "src/modules/transaction/domain/events/balance-deducted.event";

export class BalanceProjection {
    constructor(private readonly pool: Pool){}
    async project(event: BalanceDeductedEvent) {
        await this.pool.query(
            `
            UPDATE organization
            SET balance = balance - $1
            WHERE organization_id = $2
            `,
            [event.payload.amount, event.metadata.aggregateId],
        );
    }
}