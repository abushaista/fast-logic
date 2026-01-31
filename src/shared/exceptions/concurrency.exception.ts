export class ConcurrencyException extends Error {
  constructor(message = 'Concurrent modification detected') {
    super(message);
    this.name = 'ConcurrencyException';
  }
}
