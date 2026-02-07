import { DomainEvent } from "src/shared/kernel/domain-event";
import { EventMetadata } from "src/shared/kernel/event-metadata";

export type BalanceAddedEventPayload = {
    amount: number;
    currency: string;
};

export class BalanceAddedEvent extends DomainEvent<BalanceAddedEventPayload> {
    constructor(eventMetadata: EventMetadata, payload: BalanceAddedEventPayload) {
        super(eventMetadata, payload);
        this.eventType = 'BalanceAddedEvent';
    }
    getEventName(): string {
        return this.eventType;
    }

}
