import { InsufficientBalanceException } from "src/shared/exceptions/business.exception";
import { Balance } from "../entities/balance.entity";
import { Money } from "../value-objects/money.vo";

export class BalanceRule {
    static check(balance: Balance, amount: Money): void {
        if (balance.value.amount < amount.amount) {
            throw new InsufficientBalanceException();
        }
    }
}