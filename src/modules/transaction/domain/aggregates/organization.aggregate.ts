import { DomainEvent } from "src/shared/kernel/domain-event";
import { EventSourcedAggregate } from "src/shared/kernel/event-sourced-aggregate";
import { Organization } from "../entities/organization.entity";
import { Balance } from "../entities/balance.entity";
import { Money } from "../value-objects/money.vo";
import { EventMetadata } from "src/shared/kernel/event-metadata";
import { OrganizationCreatedEvent } from "../events/organization-created.event";
import { BalanceDeductedEvent } from "../events/balance-deducted.event";
import { BalanceRule } from "../rules/balance.rule";

export class OrganizationAggregate extends EventSourcedAggregate {
    constructor(id: string) {
        super();
        this.id = id;
    }
    private organization!: Organization;

    create(name: string, initialBalance: Balance, metadata: EventMetadata): void {
        this.apply(new OrganizationCreatedEvent(
            metadata,
            {
                name,
                initialBalance: initialBalance.value.amount,
                currency: initialBalance.value.currency,
            }
        ));
    }

    deductBalance(amount: Money, metadata: EventMetadata): void {
        this.ensureState();
        BalanceRule.check(this.organization.balance, amount);
        this.apply(new BalanceDeductedEvent(
            metadata,
            {
                amount: amount.amount,
                currency: amount.currency,
            }
        ));
    }

    protected when(event: DomainEvent): void {
        switch (event.getEventName()) {
            case "OrganizationCreated":
                this.organization = new Organization(
                    this.id,
                    event.payload.name,
                    new Balance(
                        Money.of(event.payload.initialBalance, event.payload.currency),
                        this.id
                    )
                );
                break;
            case "BalanceDeducted":
                this.ensureState();
                this.organization.deductBalance(
                    Money.of(event.payload.amount, event.payload.currency)
                );
                break;
            default:
                // Handle unknown events if necessary
                break;
        }
    }

    protected ensureState(): void {
        if (!this.organization) {
            this.organization = new Organization(this.id, 'Default Org', 
                new Balance(Money.of(0, 'USD'), this.id)
            );  
        }
    }

    get state(): Organization {
        this.ensureState();
        return this.organization;
    }   
    
}