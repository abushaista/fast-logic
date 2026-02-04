export class CreateCardCommand {
    constructor(
        public id: string,
        public readonly organizationId: string,
        public readonly number: string,
        public readonly dailyLimit: number,
        public readonly monthlyLimit: number,
        public readonly correlationId: string,
    ) { }
}