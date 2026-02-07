import { Injectable } from "@nestjs/common";
import { DomainEvent } from "src/shared/kernel/domain-event";
import { TransactionCreatedEvent } from "../../domain/events/transaction-created.event";
import { TransactionApprovedEvent } from "../../domain/events/transaction-approved.event";
import { TransactionRejectedEvent } from "../../domain/events/transaction-rejected.event";
import { OrganizationCreatedEvent } from "../../domain/events/organization-created.event";
import { BalanceAddedEvent } from "../../domain/events/balance-added.event";
import { BalanceDeductedEvent } from "../../domain/events/balance-deducted.event";
import { CardCreatedEvent } from "../../domain/events/card-created.event";

const EVENT_REGISTRY: Record<string, any> = {
  TransactionCreatedEvent,
  TransactionApprovedEvent,
  TransactionRejectedEvent,
  OrganizationCreatedEvent,
  BalanceAddedEvent,
  BalanceDeductedEvent,
  CardCreatedEvent,
};

@Injectable()
export class EventMapper {
  toDomain(row: any): DomainEvent {
    const ctor = EVENT_REGISTRY[row.event_name];
    if (ctor && typeof ctor === 'function') {
      return new ctor(row.metadata, row.payload);
    }

    // Fallback: construct a generic DomainEvent subclass since base constructor is protected
    class GenericDomainEvent extends DomainEvent<any> {
      constructor(metadata: any, payload: any, public override eventType: string) {
        super(metadata, payload);
      }
      getEventName(): string {
        return this.eventType;
      }
    }

    return new GenericDomainEvent(row.metadata, row.payload, row.event_name);
  }
}