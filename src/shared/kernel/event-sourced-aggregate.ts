import { DomainEvent } from './domain-event';

export abstract class EventSourcedAggregate {
  protected id!: string;
  protected version = 0;

  private readonly _uncommittedEvents: DomainEvent[] = [];

  get aggregateId(): string {
    return this.id;
  }

  get currentVersion(): number {
    return this.version;
  }

  get uncommittedEvents(): DomainEvent[] {
    return [...this._uncommittedEvents];
  }

  pullUncommittedEvents(): DomainEvent[] {
    const events = [...this._uncommittedEvents];
    this._uncommittedEvents.length = 0;
    return events;
  }

  loadFromHistory(events: DomainEvent[]): void {
    for (const event of events) {
      this.when(event);
      this.version = event.metadata.version;
    }
  }

  protected apply(event: DomainEvent): void {
    this.when(event);
    this.version++;
    this._uncommittedEvents.push(event);
  }

  clearUncommittedEvents(): void {
    this._uncommittedEvents.length = 0;
  }

  protected abstract when(event: DomainEvent): void;
}
