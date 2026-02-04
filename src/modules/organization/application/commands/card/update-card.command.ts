export class UpdateCardCommand {
    constructor(
        public readonly id: string,
        public readonly dailyLimit: number,
        public readonly monthlyLimit: number,
        public readonly correlationId: string,
    ) { }
}