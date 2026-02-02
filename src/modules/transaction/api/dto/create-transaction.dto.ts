import { IsNotEmpty, IsNumber, IsPositive, IsString, IsUUID } from 'class-validator';
export class CreateTransactionDto {
    @IsUUID()
    @IsNotEmpty()
    readonly organizationId: string;
    @IsUUID()
    @IsNotEmpty()
    readonly cardId: string;
    @IsNumber()
    @IsNotEmpty()
    @IsPositive()
    readonly amount: number;
    @IsString()
    @IsNotEmpty()
    readonly transactionKey: string;
}