export class UpdateOrganizationCommand {
    constructor(
        public id: string,
        public readonly Balance: number,
        public readonly correlationId: string,
        public readonly idempotencyKey: string,
    ) { }
}