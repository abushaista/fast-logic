import { Pool } from "pg";

export class CardProjection {
    constructor(private readonly pool: Pool) { }
}