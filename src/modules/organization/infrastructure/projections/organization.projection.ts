import { Pool } from "pg";
import { OrganizationCreatedEvent } from "../../domain/events/organization-created.event";
import { BalanceAddedEvent } from "../../domain/events/balance-added.event";

export class OrganizationProjection {
    constructor(private readonly pool: Pool) { }
    async project(event: OrganizationCreatedEvent) {

    }

    async projectUpdate(event: BalanceAddedEvent) {

    }
}