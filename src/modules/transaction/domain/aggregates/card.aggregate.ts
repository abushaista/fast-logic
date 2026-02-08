import { DomainEvent } from "src/shared/kernel/domain-event";
import { EventSourcedAggregate } from "src/shared/kernel/event-sourced-aggregate";
import { Card } from "../entities/card.entity";
import { CardCreatedEvent } from "../events/card-created.event";
import { CardLimitRule } from "../rules/card-limit.rule";
import { CardLimitUpdatedEvent } from "../events/card-limit-updated.event";
import { CardLimit } from "../value-objects/card-limit.vo";

export class CardAggregate extends EventSourcedAggregate {
    private card: Card;

    constructor(id: string) {
        super();
        this.id = id;
    }

    create(cardNumber: string, dailyLimit: number, monthlyLimit: number, metadata: any): void {
        if (this.card) {
            throw new Error("Card already created");
        }
        this.apply(new CardCreatedEvent(
            metadata,
            {
                cardNumber,
                dailyLimit,
                monthlyLimit,
            }
        ));
    }

    applyUsage(amount: number, metadata: any): void {
        this.ensureState();
        CardLimitRule.check(this.card.cardLimit, amount);
        this.apply(
            new CardLimitUpdatedEvent(
                metadata,
                {
                    cardId: this.card.id,
                    amout: amount,
                    cardLimit: this.card.cardLimit.applyTransaction(amount)
                }
            )
        );
    }

    private ensureState(): void {
        if (!this.card) {
            throw new Error("Card not created");
        }
    }

    protected when(event: DomainEvent): void {
        switch (event.getEventName()) {
            case "CardCreatedEvent":
                this.card = new Card(this.id, event.payload.cardNumber,
                    new CardLimit({
                        dailyLimit: event.payload.dailyLimit,
                        monthlyLimit: event.payload.monthlyLimit,
                        dailyUsed: 0,
                        monthlyUsed: 0
                    }));
                break;
            case "CardLimitUpdatedEvent":
                this.card.applyUsage(event.payload.amount);
                const occurredAt = event.metadata.occurredAt;
                const now = new Date();
                if(occurredAt.getDate() < now.getDate()) {
                    this.card.cardLimit.resetDailyUsage();
                }
                if(occurredAt.getMonth() < now.getMonth() && occurredAt.getFullYear() < now.getFullYear()) {
                    this.card.cardLimit.resetMonthlyUsage();
                }
                break;
            default:
                break;
        }
    }

}