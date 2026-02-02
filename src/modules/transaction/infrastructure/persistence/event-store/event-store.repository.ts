import { EventStorePort } from "src/modules/transaction/application/ports/event-store.port";
import { DomainEvent } from "src/shared/kernel/domain-event";
import { Pool } from 'pg'
import { EventMapper } from "../../mappers/event.mapper";

export class EventStoreRepository implements EventStorePort {
    constructor(
        private readonly pool: Pool,
        private readonly mapper: EventMapper
    ){}
    async load(aggregateId: string): Promise<DomainEvent[]> {
        const result = await this.pool.query(
            `SELECT * FROM event_store
            WHERE aggregate_id = $1
            ORDER BY version ASC`,
            [aggregateId],
        );
        return result.rows.map(row => this.mapper.toDomain(row));
    }
    async append(aggregateId: string, expectedVersion: number, events: DomainEvent[]): Promise<void> {
        const client = await this.pool.connect();
        try {
            await client.query('BEGIN');
            for (const event of events){
                await client.query(
                    `
                    INSERT INTO event_store
                    (id, aggregate_id, aggregate_type, version, event_name, payload, metadata)
                    VALUES ($1,$2,$3,$4,$5,$6,$7)
                    `,
                    [
                        event.metadata.eventId,
                        event.metadata.aggregateId,
                        event.metadata.aggregateType,
                        event.metadata.version,
                        event.getEventName(),
                        event.payload,
                        event.metadata,
                    ],
                );
            }
            await client.query('COMMIT');
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        }
        finally {
            client.release();
        }
    }
    
}