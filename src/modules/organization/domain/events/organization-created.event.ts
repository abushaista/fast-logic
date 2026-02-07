import { DomainEvent } from "src/shared/kernel/domain-event";
import { EventMetadata } from '../../../../shared/kernel/event-metadata';

export type OrganizationCreatedPayload = {
    name: string;
    initialBalance: number;
    currency: string;
};

export class OrganizationCreatedEvent extends DomainEvent<OrganizationCreatedPayload> {
    constructor(eventMetadata: EventMetadata, payload: OrganizationCreatedPayload) {
        super(eventMetadata, payload);
        this.eventType = "OrganizationCreatedEvent";
    }
    getEventName(): string {
        return this.eventType;
    }
}