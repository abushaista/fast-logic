import { Entity } from "src/shared/kernel/entity";
import { CardLimit } from "../value-objects/card-limit.vo";

export class Card extends Entity<string> {

    constructor(id: string,
        private readonly _cardNumber: string,
        private _cardLimit: CardLimit
    ){
        super(id);
    }
    get cardNumber(): string {
        return this._cardNumber;
    }
    get cardLimit(): CardLimit {
        return this._cardLimit;
    }

    applyUsage(amount: number): void {
        this._cardLimit = this._cardLimit.applyTransaction(amount);
    }

}