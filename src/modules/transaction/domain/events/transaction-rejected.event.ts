import { DomainEvent } from "src/shared/kernel/domain-event";
import { EventMetadata } from "src/shared/kernel/event-metadata";

export type TransactionRejectedEventPayload = {
    transactionId: string;
    reason: string;
};

export class TransactionRejectedEvent extends DomainEvent<TransactionRejectedEventPayload> {
    constructor(eventMetadata: EventMetadata, payload: TransactionRejectedEventPayload) {
        super(eventMetadata, payload);
    }

    getEventName(): string {
        return "TransactionRejectedEvent";
    }
}