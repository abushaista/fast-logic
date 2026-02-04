import { EventMetadataFactory } from "src/shared/kernel/event-metadata.factory";
import { CardAggregate } from "../../domain/aggregates/card.aggregate";
import { CreateCardCommand } from "../commands/card/create-card.command";
import { EventBusPort } from "../ports/event-bus.port";
import { EventStorePort } from "../ports/event-store.port";
import { CardResult } from "../result/card-result";

export class CardService {
    constructor(
        private readonly eventStore: EventStorePort,
        private readonly eventBus: EventBusPort,
    ) {
    }

    async CreateCard(command: CreateCardCommand): Promise<CardResult> {
        const card = new CardAggregate(command.id);
        const meta = {
            correlationId: command.correlationId,
            causationId: command.id,
        };
        card.create(command.number, command.organizationId, command.dailyLimit, command.monthlyLimit,
            EventMetadataFactory.next(card, meta)
        );
        let message: string;
        let status = 'success';

        try {
            const events = [
                ...card.pullUncommittedEvents()
            ]
            await this.eventBus.publish(events);
            message = `Card Number : ${command.number} registered successfully`;
        } catch (err) {
            message = (err as Error).message;
            status = 'failed';
        }
        return {
            cardId: command.id,
            correlationId: command.correlationId,
            status: status,
            message: message,
            occurredAt: new Date(),
        }
    }
}