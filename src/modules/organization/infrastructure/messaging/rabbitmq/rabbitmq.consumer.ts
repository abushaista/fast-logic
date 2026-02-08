import {
    Injectable,
    Inject,
    OnModuleInit,
    OnModuleDestroy,
} from '@nestjs/common';
import amqp from 'amqplib';
import { DOMAIN_EVENTS_EXCHANGE, QUEUES, RABBITMQ_CHANNEL, ROUTING_KEYS } from './rabbitmq.constants';
import { OrganizationProjection } from '../../persistence/projections/organization.projection';
import { DomainEvent } from 'src/shared/kernel/domain-event';
import type { EventStorePort } from 'src/modules/organization/application/ports/event-store.port';
import { CardProjection } from '../../persistence/projections/card.projection';

@Injectable()
export class RabbitMQConsumer implements OnModuleInit, OnModuleDestroy {
    constructor(
        @Inject(RABBITMQ_CHANNEL)
        private readonly channel: amqp.Channel,
        private readonly organzationProjection: OrganizationProjection,
        private readonly cardProjection: CardProjection,
        @Inject('EventStorePort')
        private readonly eventStore: EventStorePort
    ) { }
    onModuleDestroy() {
        this.channel.close();
    }
    async onModuleInit() {
        await this.start();
    }
    async start() {
        await this.channel.assertQueue(
            QUEUES.ORGANIZATION_CREATED,
            { durable: true },
        );
        await this.channel.bindQueue(
            QUEUES.ORGANIZATION_CREATED,
            DOMAIN_EVENTS_EXCHANGE,
            ROUTING_KEYS.ORGANIZATION_CREATED,
        );
        await this.channel.consume(QUEUES.ORGANIZATION_CREATED,
            async msg => {
                if (!msg) return;
                try {
                    const event: DomainEvent = JSON.parse(msg.content.toString());
                    console.log(event)
                    switch (event.eventType) {
                        case 'OrganizationCreatedEvent':
                            await this.organzationProjection.project(event);
                            // handled below
                            break;
                        case 'BalanceAddedEvent':
                            await this.organzationProjection.projectUpdate(event);
                            break;
                        case 'BalanceDeductedEvent':
                            this.channel.ack(msg);
                            return;
                        case 'CardCreatedEvent':
                            this.cardProjection.project(event);
                            break;
                        default:
                            console.warn(`Unhandled event type: ${event.eventType}`);
                            this.channel.ack(msg);
                            return;
                    }
                    this.channel.ack(msg);
                    return;
                } catch (error) {
                    console.error('RabbitMQ consumer error', error);
                    this.channel.nack(msg, false, false);
                }
            },
            { noAck: false }
        );
    }
}