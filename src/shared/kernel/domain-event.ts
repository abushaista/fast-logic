import { EventMetadata } from './event-metadata';

export abstract class DomainEvent<T = any> {
  readonly metadata: EventMetadata;
  readonly payload: T;
  eventType: string;

  protected constructor(metadata: EventMetadata, payload: T) {
    this.metadata = metadata;
    this.payload = payload;
  }

  abstract getEventName(): string;
}
