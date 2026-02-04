import { Balance } from "../entities/balance.entity";
import { Money } from "../value-objects/money.vo";

export class BalanceRule {
    static check(balance: Balance, amount: Money): void {
        if (balance.value.amount < amount.amount) {
            throw new Error('Insufficient balance');
        }
    }
}