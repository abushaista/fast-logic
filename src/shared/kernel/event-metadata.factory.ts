import { EventMetadata } from "./event-metadata";
import { EventSourcedAggregate } from "./event-sourced-aggregate";

export class EventMetadataFactory {
    static create(params: {
        aggregateId: string;
        aggregateType: string;
        version: number;
        correlationId?: string;
        causationId?: string;
    }): EventMetadata {
        return {
            eventId: crypto.randomUUID(),
            aggregateId: params.aggregateId,
            aggregateType: params.aggregateType,
            version: params.version, 
            occurredAt: new Date(),
            correlationId: params.correlationId,
            causationId: params.causationId,
        };  
        
    }
    static next(aggregate: EventSourcedAggregate, 
        context?: Partial<EventMetadata>): EventMetadata {
        return this.create({
            aggregateId: aggregate.aggregateId,
            aggregateType: aggregate.constructor.name,
            version: aggregate.currentVersion + 1,
            correlationId: context?.correlationId,
            causationId: context?.causationId,
        });
    }
}