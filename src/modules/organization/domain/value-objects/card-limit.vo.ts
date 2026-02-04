import { ValueObject } from "src/shared/kernel/value-object";

interface CardLimitProps {
  dailyLimit: number;
  monthlyLimit: number;
  dailyUsed: number;
  monthlyUsed: number;
}

export class CardLimit extends ValueObject<CardLimitProps> {
  constructor(props: CardLimitProps) {
    super(props)
  }
  protected Validate(props: CardLimitProps): void {
    if (props.dailyLimit < 0) {
      throw new Error('Daily limit cannot be negative');
    }
    if (props.monthlyLimit < 0) {
      throw new Error('Monthly limit cannot be negative');
    }
    if (props.dailyUsed < 0) {
      throw new Error('Daily used amount cannot be negative');
    }
    if (props.monthlyUsed < 0) {
      throw new Error('Monthly used amount cannot be negative');
    }
    if (props.dailyUsed > props.dailyLimit) {
      throw new Error('Daily used amount cannot exceed daily limit');
    }
    if (props.monthlyUsed > props.monthlyLimit) {
      throw new Error('Monthly used amount cannot exceed monthly limit');
    }
  }

  applyTransaction(amount: number): CardLimit {
    const newDailyUsed = this.props.dailyUsed + amount;
    const newMonthlyUsed = this.props.monthlyUsed + amount;
    return new CardLimit({
      dailyLimit: this.props.dailyLimit,
      monthlyLimit: this.props.monthlyLimit,
      dailyUsed: newDailyUsed,
      monthlyUsed: newMonthlyUsed,
    });
  }

  resetDailyUsage(): CardLimit {
    return new CardLimit({
      dailyLimit: this.props.dailyLimit,
      monthlyLimit: this.props.monthlyLimit,
      dailyUsed: 0,
      monthlyUsed: this.props.monthlyUsed,
    });
  }

  resetMonthlyUsage(): CardLimit {
    return new CardLimit({
      dailyLimit: this.props.dailyLimit,
      monthlyLimit: this.props.monthlyLimit,
      dailyUsed: this.props.dailyUsed,
      monthlyUsed: 0,
    });
  }

  get dailyRemaining(): number {
    return this.props.dailyLimit - this.props.dailyUsed;
  }

  get monthlyRemaining(): number {
    return this.props.monthlyLimit - this.props.monthlyUsed;
  }
}   