import { EventMetadataFactory } from "src/shared/kernel/event-metadata.factory";
import { CardAggregate } from "../../domain/aggregates/card.aggregate";
import { CreateCardCommand } from "../commands/card/create-card.command";
import type { EventBusPort } from "../ports/event-bus.port";
import type { EventStorePort } from "../ports/event-store.port";
import { CardResult } from "../result/card-result";
import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { OrganizationAggregate } from "../../domain/aggregates/organization.aggregate";

@Injectable()
export class CardService {
    constructor(
        @Inject('EventStorePort')
        private readonly eventStore: EventStorePort,
        @Inject('EventBusPort')
        private readonly eventBus: EventBusPort,
    ) {
    }

    async CreateCard(command: CreateCardCommand): Promise<CardResult> {
        const organization = new OrganizationAggregate(command.organizationId);
        const events = await this.eventStore.load(command.organizationId);
        if (!events || events.length == 0) {
            throw new NotFoundException(`Organization ${command.organizationId} not found`);
        }
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
            await this.eventStore.append(card.aggregateId, card.currentVersion, events);
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