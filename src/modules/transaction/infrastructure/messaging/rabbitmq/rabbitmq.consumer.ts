import {
    Injectable,
    Inject,
    OnModuleInit,
    OnModuleDestroy,
} from '@nestjs/common';
import amqp from 'amqplib';
import { TransactionProjection } from '../../persistence/projections/transaction.projection';
import { DOMAIN_EVENTS_EXCHANGE, QUEUES, RABBITMQ_CHANNEL, ROUTING_KEYS } from './rabbitmq.constants';
import { BalanceProjection } from '../../persistence/projections/balance.projection';
import { DomainEvent } from 'src/shared/kernel/domain-event';

@Injectable()
export class RabbitMQConsumer implements OnModuleInit, OnModuleDestroy {
    constructor(
        @Inject(RABBITMQ_CHANNEL)
        private readonly channel: amqp.Channel,
        private readonly transactionProjection: TransactionProjection,
        private readonly balanceProjection: BalanceProjection,
    ) { }
    onModuleDestroy() {
        this.channel.close();
    }
    async onModuleInit() {
        await this.start();
    }
    async start() {
        console.log('start rmq');
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
                    const event: DomainEvent = JSON.parse(msg.content.toString());
                    switch (event.eventType) {
                        case 'TransactionApprovedEvent':
                            await this.transactionProjection.project(event);
                            break;
                        case 'TransactionApprovedEvent':
                            await this.transactionProjection.projectUpdate(event);
                            break;
                        case 'BalanceDeductedEvent':
                            await this.balanceProjection.project(event);
                            this.channel.ack(msg);
                            return;
                        default:
                            console.warn(`Unhandled event type: ${event.eventType}`);
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