import { EventMetadataFactory } from "src/shared/kernel/event-metadata.factory";
import { CardAggregate } from "../../domain/aggregates/card.aggregate";
import { OrganizationAggregate } from "../../domain/aggregates/organization.aggregate";
import { TransactionAggregate } from "../../domain/aggregates/transaction.aggregate";
import { Card } from "../../domain/entities/card.entity";
import { ProcessTransactionCommand } from "../commands/process-transaction.command";
import type { EventBusPort } from "../ports/event-bus.port";
import type { EventStorePort } from "../ports/event-store.port";
import { TransactionResult } from '../results/transaction-result';
import { TransactionStatus } from "../../domain/value-objects/transaction-status.vo";
import { Inject, Injectable, Logger, NotFoundException } from "@nestjs/common";

@Injectable()
export class TransactionService {
    private readonly logger = new Logger(TransactionService.name);
    constructor(
        @Inject('EventStorePort')
        private readonly eventStore: EventStorePort,
        @Inject('EventBusPort')
        private readonly eventBus: EventBusPort,
    ) { }

    async processTransaction(command: ProcessTransactionCommand): Promise<TransactionResult> {
        const organizationEvents = await this.eventStore.load(command.organizationId);
        this.logger.debug(`organization id ${command.organizationId}`)

        if (!organizationEvents || organizationEvents.length === 0) {
            this.logger.warn(`No events found for organization ${command.organizationId}`);
            throw new NotFoundException(`Organization ${command.organizationId} not found`);
        }

        const Organization = new OrganizationAggregate(command.organizationId);
        Organization.loadFromHistory(organizationEvents);

        const cardEvents = await this.eventStore.load(command.cardId, true);
        if (!cardEvents || cardEvents.length == 0) {
            throw new NotFoundException(`Card ${command.cardId} not found`);
        }
        const Card = new CardAggregate(command.cardId);
        Card.loadFromHistory(cardEvents);

        const Transaction = new TransactionAggregate(command.transactionId);
        const meta = {
            correlationId: command.correlationId,
            causationId: command.transactionId,
        };
        Transaction.create(
            command.cardId,
            command.amount.amount,
            TransactionStatus.PENDING,
            EventMetadataFactory.next(Transaction, meta)
        );
        let message: string;
        try {
            Organization.deductBalance(command.amount,
                EventMetadataFactory.next(Organization, meta));
            Card.applyUsage(command.amount.amount,
                EventMetadataFactory.next(Card, meta)
            );

            Transaction.approve(
                EventMetadataFactory.next(Transaction, meta)
            );
            message = `Transaction: ${command.transactionId} success`;
        } catch (error) {
            message = (error as Error).message;
            Transaction.reject(
                EventMetadataFactory.next(Transaction, meta),
                message
            );
        }

        const allEvents = [
            ...Organization.pullUncommittedEvents(),
            ...Card.pullUncommittedEvents(),
            ...Transaction.pullUncommittedEvents(),
        ];
        await this.eventBus.publish(allEvents);

        return {
            transactionId: command.transactionId,
            status: Transaction.status,
            message: message,
            occurredAt: new Date(),
        }
    }
}