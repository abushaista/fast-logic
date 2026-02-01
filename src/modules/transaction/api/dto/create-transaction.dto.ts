import { IsNotEmpty, IsNumber, IsPositive, IsString, IsUUID } from 'class-validator';
export class CreateTransactionDto {
    @IsUUID()
    @IsNotEmpty()
    readonly organizationId: string;
    @IsString()
    @IsNotEmpty()
    readonly cardNo: string;
    @IsNumber()
    @IsNotEmpty()
    @IsPositive()
    readonly amount: number;
}