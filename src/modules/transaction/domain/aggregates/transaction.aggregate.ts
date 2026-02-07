import { DomainEvent } from "src/shared/kernel/domain-event";
import { EventSourcedAggregate } from "src/shared/kernel/event-sourced-aggregate";
import { TransactionStatus } from "../value-objects/transaction-status.vo";
import { TransactionCreatedEvent } from "../events/transaction-created.event";
import { EventMetadata } from "src/shared/kernel/event-metadata";
import { TransactionApprovedEvent } from "../events/transaction-approved.event";
import { TransactionRejectedEvent } from "../events/transaction-rejected.event";

export class TransactionAggregate extends EventSourcedAggregate {
    private transactionStatus: TransactionStatus;
    constructor(id: string) {
        super();
        this.id = id;
        this.transactionStatus = TransactionStatus.PENDING;
    }

    create(cardId: string, amount: number, status: TransactionStatus, metadata: EventMetadata): void {
        if (this.transactionStatus !== TransactionStatus.PENDING) {
            throw new Error("Transaction already created");
        }
        this.apply(new TransactionCreatedEvent(metadata, {
            cardId,
            amount,
            status
        }));
        this.transactionStatus = status;
    }

    approve(metadata: EventMetadata): void {
        if (this.transactionStatus === TransactionStatus.COMPLETED) return;
        if (this.transactionStatus !== TransactionStatus.PENDING) {
            throw new Error("Only pending transactions can be approved");
        }
        this.apply(new TransactionApprovedEvent(metadata, {
            transactionId: this.id,
            status: TransactionStatus.COMPLETED,
            approvedAt: new Date()
        }));
    }

    reject(metadata: EventMetadata, reason: string): void {
        if (this.transactionStatus === TransactionStatus.FAILED) return;
        if (this.transactionStatus !== TransactionStatus.PENDING) {
            throw new Error("Only pending transactions can be rejected");
        }
        this.apply(new TransactionRejectedEvent(metadata, {
            transactionId: this.id,
            reason
        }));
    }

    protected when(event: DomainEvent): void {
        switch (event.getEventName()) {
            case "TransactionCreatedEvent":
                this.transactionStatus = event.payload.status;
                break;
            case "TransactionApprovedEvent":
                this.transactionStatus = event.payload.status;
                break;
            case "TransactionRejectedEvent":
                this.transactionStatus = TransactionStatus.FAILED;
                break;
            default:
            // Handle unknown events if necessary
        }
    }

    get status(): TransactionStatus {
        return this.transactionStatus;
    }

}