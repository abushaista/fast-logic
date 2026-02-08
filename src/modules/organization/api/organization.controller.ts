import { Body, Controller, Param, Post, Put, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { OrganizationCommandHandler } from '../application/commands/organization/handler/organization-command.handler';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { CreateOrganizationCommand } from '../application/commands/organization/create-organization.command';
import { UuidUtil } from 'src/shared/utils/uuid.util';
import { UpdateBalanceDto } from './dto/update-balance.dto';
import { UpdateOrganizationCommand } from '../application/commands/organization/update-organization.command';

@ApiTags('organization')
@Controller('organization')
export class OrganizationController {
    constructor(
        private readonly commandHandler: OrganizationCommandHandler
    ) { }

    @Post()
    @ApiOperation({ summary: 'Create a new organization' })
    @ApiBody({ type: CreateOrganizationDto })
    @ApiResponse({ status: 201, description: 'Organization created successfully' })
    async createOrganization(@Body() dto: CreateOrganizationDto,
        @Req() req: any,) {
        const command: CreateOrganizationCommand = new CreateOrganizationCommand(
            UuidUtil.generate(),
            dto.organizationName,
            dto.initialBalance,
            dto.currency,
            req.correlationId,
        );
        const result = await this.commandHandler.createOrganization(command);
        return result;
    }

    @Put(':organizationId')
    @ApiOperation({ summary: 'Update organization balance' })
    @ApiBody({ type: UpdateBalanceDto })
    @ApiResponse({ status: 200, description: 'Balance updated successfully' })
    updateOrganizationBalance(
        @Param('organizationId') id: string,
        @Body() dto: UpdateBalanceDto,
        @Req() req: any,) {
        const command: UpdateOrganizationCommand = new UpdateOrganizationCommand(
            id,
            dto.balance,
            req.correlationId,
            dto.transactionKey,
        );
        return this.commandHandler.UpdateBalance(command);
    }

}
