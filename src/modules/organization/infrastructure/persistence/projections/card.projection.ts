import { Pool } from "pg";
import { CardCreatedEvent } from "src/modules/organization/domain/events/card-created.event";

export class CardProjection {
    constructor(private readonly pool: Pool) { }
    async project(event: CardCreatedEvent) {
        await this.pool.query(
            `INSERT INTO card (card_id, organization_id, card_number, daily_limit, monthly_limit, status, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, true, now(), now())
            `, [
                event.metadata.aggregateId,
                event.payload.organizationId,
                event.payload.cardNumber,
                event.payload.dailyLimit,
                event.payload.monthlyLimit
            ]

        )
    }
}