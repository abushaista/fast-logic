import { DomainEvent } from "src/shared/kernel/domain-event";

export class EventMapper {
  toDomain(row: any): DomainEvent {
    return new (global as any)[row.event_name](
      row.metadata,
      row.payload,
    );
  }
}