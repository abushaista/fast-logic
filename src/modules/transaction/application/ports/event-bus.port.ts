import { DomainEvent } from "src/shared/kernel/domain-event";

export interface EventBusPort {
  publish(events: DomainEvent[]): Promise<void>;
}