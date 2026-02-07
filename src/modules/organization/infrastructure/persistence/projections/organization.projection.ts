import { Pool } from "pg";
import { OrganizationCreatedEvent } from "src/modules/organization/domain/events/organization-created.event";
import { BalanceAddedEvent } from "src/modules/organization/domain/events/balance-added.event";
import { Injectable } from "@nestjs/common";

@Injectable()
export class OrganizationProjection {
    constructor(private readonly pool: Pool) { }
    async project(event: OrganizationCreatedEvent) {
        await this.pool.query(
            `
            INSERT INTO organization (organization_id, 
            organization_name, balance, currency,
            status, version, created_at , updated_at)
            VALUES ($1, $2, $3, $4, true, $5, now(), now())
            ON CONFLICT (organization_id)
            DO UPDATE SET balance = $3, updated_at = now(), version = $5
            `,
            [event.metadata.aggregateId, event.payload.name, event.payload.initialBalance, event.payload.currency, event.metadata.version],
        );
    }

    async projectUpdate(event: BalanceAddedEvent) {
        await this.pool.query(
            `
            UPDATE organization SET balance = $1, updated_at = now(), version = $2
            WHERE organization_id = $3
            `,
            [event.payload.amount, event.metadata.version, event.metadata.aggregateId]
        )
    }
}