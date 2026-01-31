export interface EventMetadata {
  readonly eventId: string;
  readonly aggregateId: string;
  readonly aggregateType: string;
  readonly version: number;        // aggregate version
  readonly occurredAt: Date;        // timeline
}