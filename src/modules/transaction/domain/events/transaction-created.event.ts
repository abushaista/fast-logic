import { DomainEvent } from "src/shared/kernel/domain-event";
import { EventMetadata } from "src/shared/kernel/event-metadata";
import { TransactionStatus } from "../value-objects/transaction-status.vo";

export type TransactionCreatedEventPayload = {
    cardId: string;
    amount: number;
    status: TransactionStatus
};

export class TransactionCreatedEvent extends DomainEvent<TransactionCreatedEventPayload> {
    constructor(eventMetadata: EventMetadata, payload: TransactionCreatedEventPayload) {
        super(eventMetadata, payload);
    }
    getEventName(): string {
        return "TransactionCreatedEvent";
    }
}