import { Pool } from "pg";
import { CardCreatedEvent } from '../../../../transaction/domain/events/card-created.event';

export class CardProjection {
    constructor(private readonly pool: Pool) { }
    async project(event: CardCreatedEvent) {
        
    }
}