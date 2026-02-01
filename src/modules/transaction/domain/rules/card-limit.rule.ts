import { CardLimit } from '../value-objects/card-limit.vo';
export class CardLimitRule {
    static check(cardLimit: CardLimit, amount: number): void {
        if (amount > cardLimit.dailyRemaining) {
            throw new Error('Daily card limit exceeded');
        }

        if (amount > cardLimit.monthlyRemaining) {
            throw new Error('Monthly card limit exceeded');
        }
    }
}