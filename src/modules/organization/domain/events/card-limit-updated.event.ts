import { DomainEvent } from "src/shared/kernel/domain-event";
import { EventMetadata } from "src/shared/kernel/event-metadata";
import { CardLimit } from "../value-objects/card-limit.vo";

export type CardLimitUpdatedEventPayload = {
    cardId: string;
    amount: Number,
    cardLimit: CardLimit;
};

export class CardLimitUpdatedEvent extends DomainEvent<CardLimitUpdatedEventPayload> {
    constructor(eventMetadata: EventMetadata, payload: CardLimitUpdatedEventPayload) {
        super(eventMetadata, payload);
        this.eventType = "CardLimitUpdatedEvent";
    }
    getEventName(): string {
        return this.eventType;
    }
}