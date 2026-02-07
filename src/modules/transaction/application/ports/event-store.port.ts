import { DomainEvent } from "src/shared/kernel/domain-event";

export interface EventStorePort {
  load(aggregateId: string, isCurrentMonth?: boolean): Promise<DomainEvent[]>;
  append(
    aggregateId: string,
    expectedVersion: number,
    events: DomainEvent[],
  ): Promise<void>;
}
