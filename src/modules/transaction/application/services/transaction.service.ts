import { EventMetadataFactory } from "src/shared/kernel/event-metadata.factory";
import { CardAggregate } from "../../domain/aggregates/card.aggregate";
import { OrganizationAggregate } from "../../domain/aggregates/organization.aggregate";
import { TransactionAggregate } from "../../domain/aggregates/transaction.aggregate";
import { Card } from "../../domain/entities/card.entity";
import { ProcessTransactionCommand } from "../commands/process-transaction.command";
import { EventBusPort } from "../ports/event-bus.port";
import { EventStorePort } from "../ports/event-store.port";
import { TransactionResult } from '../results/transaction-result';
import { TransactionStatus } from "../../domain/value-objects/transaction-status.vo";

export class TransactionService {

    constructor(
        private readonly eventStore: EventStorePort,
        private readonly eventBus: EventBusPort,
    ) {}

    async processTransaction(command: ProcessTransactionCommand): Promise<TransactionResult> {
        const organizationEvents = await this.eventStore.load(command.organizationId);
        const Organization = new OrganizationAggregate(command.organizationId);
        Organization.loadFromHistory(organizationEvents);

        const cardEvents = await this.eventStore.load(command.cardId);
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
            EventMetadataFactory.next(Transaction,meta)
        );
        let message: string;
        try {   
            Organization.deductBalance(command.amount, 
                EventMetadataFactory.next(Organization,meta));
            Card.applyUsage(command.amount.amount,
                EventMetadataFactory.next(Card,meta)
            );
            
            Transaction.approve(
                EventMetadataFactory.next(Transaction,meta)
            );
            message = `Transaction: ${command.transactionId} success`;
        } catch (error) {
            message = (error as Error).message;
            Transaction.reject(
                EventMetadataFactory.next(Transaction,meta),
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