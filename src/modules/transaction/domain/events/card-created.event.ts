import { DomainEvent } from "src/shared/kernel/domain-event";
import { EventMetadata } from "src/shared/kernel/event-metadata";

export type CardCreatedEventPayload = {
    cardNumber: string;
    dailyLimit: number;
    monthlyLimit: number;
};

export class CardCreatedEvent extends DomainEvent<CardCreatedEventPayload>  {
    constructor(eventMetadata: EventMetadata, payload: CardCreatedEventPayload) {
        super(eventMetadata, payload);
    }
    getEventName(): string {
        return "CardCreated";
    }
}