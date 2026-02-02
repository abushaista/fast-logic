import { DomainEvent } from "src/shared/kernel/domain-event";
import { TransactionStatus } from "../value-objects/transaction-status.vo";
import { EventMetadata } from "src/shared/kernel/event-metadata";

export type TransactionApprovedEventPayload = {
    transactionId: string;
    status: TransactionStatus;
    approvedAt: Date;
};

export class TransactionApprovedEvent extends DomainEvent<TransactionApprovedEventPayload> {
    constructor(eventMetadata: EventMetadata, payload: TransactionApprovedEventPayload) {
        super(eventMetadata, payload);
    }
    getEventName(): string {
        return "TransactionApprovedEvent";
    }
}