import { EventMetadata } from "./event-metadata";

export class EventMetadataFactory {
    static create(params: {
        aggregateId: string;
        aggregateType: string;
        eventType: string;
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
}