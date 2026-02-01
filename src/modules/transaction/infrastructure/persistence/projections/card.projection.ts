import { Pool } from "pg";
import { CardLimitUpdatedEvent } from "src/modules/transaction/domain/events/card-limit-updated.event";

export class CardProjection {
    constructor(private readonly pool: Pool){
    }
    async project(event: CardLimitUpdatedEvent){
        
    }
}