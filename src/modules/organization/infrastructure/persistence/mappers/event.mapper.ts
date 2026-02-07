import { DomainEvent } from "src/shared/kernel/domain-event";
import { OrganizationCreatedEvent } from "../../../domain/events/organization-created.event";
import { BalanceAddedEvent } from "../../../domain/events/balance-added.event";
import { BalanceDeductedEvent } from "../../../domain/events/balance-deducted.event";
import { CardCreatedEvent } from "../../../domain/events/card-created.event";

const EVENT_REGISTRY: Record<string, any> = {
  OrganizationCreatedEvent,
  BalanceAddedEvent,
  BalanceDeductedEvent,
  CardCreatedEvent,
};

export class EventMapper {
  toDomain(row: any): DomainEvent {
    const ctor = EVENT_REGISTRY[row.event_name];
    if (ctor && typeof ctor === 'function') {
      return new ctor(row.metadata, row.payload);
    }

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