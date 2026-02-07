import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";

export class CreateOrganizationDto {

    @ApiProperty({ description: 'Organization name', example: 'Acme Corp' })
    @IsString()
    @IsNotEmpty()
    readonly organizationName: string;

    @ApiProperty({ description: 'Initial balance', example: 10000, minimum: 0 })
    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    readonly initialBalance: number;

    @ApiProperty({ description: 'Currency code', example: 'USD' })
    @IsString()
    @IsNotEmpty()
    readonly currency: string;

}