import { Entity } from "src/shared/kernel/entity";
import { Balance } from "./balance.entity";
import { Money } from "../value-objects/money.vo";

export class Organization extends Entity<string> {
    constructor(id: string,
    private readonly _name: string,
    private _balance: Balance,
) {
        super(id);
    }
    get name(): string {
        return this._name;
    }
    get balance(): Balance {
        return this._balance;
    }
    deductBalance(amount: Money): void {
        this._balance = this._balance.deduct(amount);
    }
}