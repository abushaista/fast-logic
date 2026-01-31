import { DomainException } from './domain-exception';

export class InsufficientBalanceException extends DomainException {
  constructor() {
    super('Insufficient organization balance');
  }
}

export class CardLimitExceededException extends DomainException {
  constructor() {
    super('Card limit exceeded');
  }
}
