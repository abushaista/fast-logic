export class CreateCardDto {
    readonly organizationId: string;
    readonly cardNumber: string;
    readonly dailyLimit: number;
    readonly monthlyLimit: number;
}