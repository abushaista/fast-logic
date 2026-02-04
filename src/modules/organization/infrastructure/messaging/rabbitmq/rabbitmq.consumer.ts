import {
    Injectable,
    Inject,
    OnModuleInit,
    OnModuleDestroy,
} from '@nestjs/common';
import amqp from 'amqplib';
import { DOMAIN_EVENTS_EXCHANGE, QUEUES, RABBITMQ_CHANNEL, ROUTING_KEYS } from './rabbitmq.constants';
import { OrganizationProjection } from '../../projections/organization.projection';

@Injectable()
export class RabbitMQConsumer implements OnModuleInit, OnModuleDestroy {
    constructor(
        @Inject(RABBITMQ_CHANNEL)
        private readonly channel: amqp.Channel,
        private readonly organzationProjection: OrganizationProjection,
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
                    const event = JSON.parse(msg.content.toString());
                    switch (event.type) {
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
                            this.channel.ack(msg);
                            break;
                        default:
                            console.warn(`Unhandled event type: ${event.type}`);
                            this.channel.ack(msg);
                            return;
                    }


                    this.channel.ack(msg);
                } catch (error) {
                    console.error('RabbitMQ consumer error', error);
                    this.channel.nack(msg, false, false);
                }
            },
            { noAck: false }
        );
    }
}