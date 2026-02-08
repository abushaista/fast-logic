import { IsNotEmpty, IsNumber, IsPositive, IsString, IsUUID } from "class-validator";

export class CreateCardDto {
    @IsUUID()
    @IsNotEmpty()
    readonly organizationId: string;
    @IsString()
    @IsNotEmpty()
    readonly cardNumber: string;
    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    readonly dailyLimit: number;
    @IsNotEmpty()
    @IsPositive()
    @IsNumber()
    readonly monthlyLimit: number;
}