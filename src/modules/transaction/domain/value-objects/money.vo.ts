import { ValueObject } from "src/shared/kernel/value-object";

interface MoneyProps {
  amount: number;
  currency: string;
}

export class Money extends ValueObject<MoneyProps> {
  get amount(): number {
    return this.props.amount;
  }

  get currency(): string {
    return this.props.currency;
  }

  protected Validate(props: MoneyProps): void {
    if (props.amount < 0) {
      throw new Error('Amount cannot be negative');
    }
    if (!props.currency) {
      throw new Error('Currency must be provided');
    }
  }

  static of(amount: number, currency: string): Money {
    return new Money({ amount, currency });
  }

  add(money: Money): Money {
    this.ensureSameCurrency(money);
    return new Money({
      amount: this.amount + money.amount,
      currency: this.currency,
    });
  }

  subtract(money: Money): Money {
    this.ensureSameCurrency(money);
    return new Money({
      amount: this.amount - money.amount,
      currency: this.currency,
    });
  }

  private ensureSameCurrency(money: Money): void {
    if (this.currency !== money.currency) {
      throw new Error('Cannot operate on Money with different currencies');
    }
  }
}