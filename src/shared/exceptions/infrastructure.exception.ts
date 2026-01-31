export class InfrastructureException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InfrastructureException';
  }
}
