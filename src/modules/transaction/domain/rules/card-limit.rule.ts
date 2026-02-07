import { CardLimitExceededException } from 'src/shared/exceptions/business.exception';
import { CardLimit } from '../value-objects/card-limit.vo';
export class CardLimitRule {
    static check(cardLimit: CardLimit, amount: number): void {
        if (amount > cardLimit.dailyRemaining) {
            throw new CardLimitExceededException('Daily');
        }

        if (amount > cardLimit.monthlyRemaining) {
            throw new CardLimitExceededException('Monthly');
        }
    }
}