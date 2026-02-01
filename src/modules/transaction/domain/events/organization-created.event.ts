import { DomainEvent } from "src/shared/kernel/domain-event";
import { Organization } from "../entities/organization.entity";
import { EventMetadata } from '../../../../shared/kernel/event-metadata';

export type OrganizationCreatedPayload = {
  name: string;
  initialBalance: number;
  currency: string;
};

export class OrganizationCreatedEvent extends DomainEvent<OrganizationCreatedPayload>  {
    constructor(eventMetadata: EventMetadata, payload: OrganizationCreatedPayload) {
        super(eventMetadata, payload);
    }
    getEventName(): string {
        return "OrganizationCreated";
    }
}