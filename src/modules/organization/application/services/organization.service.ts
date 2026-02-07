import { EventMetadataFactory } from "src/shared/kernel/event-metadata.factory";
import { OrganizationAggregate } from "../../domain/aggregates/organization.aggregate";
import { Balance } from "../../domain/entities/balance.entity";
import { Money } from "../../domain/value-objects/money.vo";
import { CreateOrganizationCommand } from "../commands/organization/create-organization.command";
import { OrganizationResult } from "../result/organization-result";
import type { EventStorePort } from "../ports/event-store.port";
import type { EventBusPort } from "../ports/event-bus.port";
import { UpdateOrganizationCommand } from "../commands/organization/update-organization.command";
import { Inject, Injectable } from "@nestjs/common";
@Injectable()
export class OrganizationService {
    constructor(
        @Inject('EventStorePort')
        private readonly eventStore: EventStorePort,
        @Inject('EventBusPort')
        private readonly eventBus: EventBusPort,
    ) { }
    async CreateOrganization(command: CreateOrganizationCommand): Promise<OrganizationResult> {
        const Organization = new OrganizationAggregate(command.id);

        const meta = {
            correlationId: command.correlationId,
            causationId: command.id,
        };
        const money = new Money({
            currency: command.currency,
            amount: command.initialBalance
        });
        const balance = new Balance(money, command.id);
        Organization.create(command.name, balance, EventMetadataFactory.next(Organization, meta));
        let message: string;
        let status = 'success';
        try {
            const events = [
                ...Organization.pullUncommittedEvents()
            ]
            await this.eventStore.append(Organization.aggregateId, Organization.currentVersion, events);
            await this.eventBus.publish(events);
            message = `Organization : ${command.name} registered successfully`;
        } catch (error) {
            message = (error as Error).message;
            console.log(error);
            status = 'failed';
        }

        return {
            organizationId: command.id,
            organizationName: command.name,
            status: status,
            correlationId: command.correlationId,
            message: message,
            occurredAt: new Date(),
        }
    }

    async UpdateBalance(command: UpdateOrganizationCommand): Promise<OrganizationResult> {
        const organizationEvents = await this.eventStore.load(command.id);
        const Organization = new OrganizationAggregate(command.id);
        Organization.loadFromHistory(organizationEvents);
        const meta = {
            correlationId: command.correlationId,
            causationId: command.id,
        };
        let message: string;
        let status = 'success';
        try {
            const money = new Money({
                currency: 'USD',
                amount: command.Balance
            });
            Organization.addBalance(money, EventMetadataFactory.next(Organization, meta))
            const events = [
                ...Organization.pullUncommittedEvents()
            ]
            await this.eventBus.publish(events);
            message = `Balance updated successfully`;
            status = 'failed';
        } catch (error) {
            message = (error as Error).message;
            status = 'failed';
        }


        return {
            organizationId: command.id,
            organizationName: '',
            status: status,
            correlationId: command.correlationId,
            message: message,
            occurredAt: new Date(),
        }
    }
}