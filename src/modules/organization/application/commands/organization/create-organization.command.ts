export class CreateOrganizationCommand {
    constructor(
        public id: string,
        public readonly name: string,
        public readonly initialBalance: number,
        public readonly currency: string,
        public readonly correlationId: string,
    ) { }
}