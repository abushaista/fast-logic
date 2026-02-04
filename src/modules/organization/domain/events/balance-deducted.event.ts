import { DomainEvent } from "src/shared/kernel/domain-event";
import { EventMetadata } from "src/shared/kernel/event-metadata";

export type BalanceDeductedEventPayload = {
    amount: number;
    currency: string;
};

export class BalanceDeductedEvent extends DomainEvent<BalanceDeductedEventPayload> {
    constructor(eventMetadata: EventMetadata, payload: BalanceDeductedEventPayload) {
        super(eventMetadata, payload);
    }
    getEventName(): string {
        return "BalanceDeductedEvent";
    }
}