import {
    Injectable,
    Inject,
    OnModuleInit,
    OnModuleDestroy,
} from '@nestjs/common';
import amqp from 'amqplib';
import { TransactionProjection } from '../../persistence/projections/transaction.projection';
import { DOMAIN_EVENTS_EXCHANGE, QUEUES, RABBITMQ_CHANNEL, ROUTING_KEYS } from './rabbitmq.constants';

@Injectable()
export class RabbitMQConsumer implements OnModuleInit, OnModuleDestroy {
    constructor(
        @Inject(RABBITMQ_CHANNEL)
        private readonly channel: amqp.Channel,
        private readonly transactionProjection: TransactionProjection,
    ) { }
    onModuleDestroy() {
        this.channel.close();
    }
    async onModuleInit() {
        await this.start();
    }
    async start() {
        await this.channel.assertQueue(
            QUEUES.TRANSACTION_APPROVED,
            { durable: true },
        );
        await this.channel.bindQueue(
            QUEUES.TRANSACTION_APPROVED,
            DOMAIN_EVENTS_EXCHANGE,
            ROUTING_KEYS.TRANSACTION_APPROVED,
        );
        await this.channel.consume(QUEUES.TRANSACTION_APPROVED,
            async msg => {
                if (!msg) return;
                try {
                    const event = JSON.parse(msg.content.toString());
                    switch (event.type) {
                        case 'TransactionApprovedEvent':
                            await this.transactionProjection.project(event);
                            // handled below
                            break;
                        case 'BalanceDeductedEvent':
                            // Future implementation
                            this.channel.ack(msg);
                            return;
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