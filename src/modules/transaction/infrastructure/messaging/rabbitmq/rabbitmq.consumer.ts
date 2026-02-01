import amqp from 'amqplib';
import { TransactionProjection } from '../../persistence/projections/transaction.projection';

export class RabbitMQConsumer {
    constructor(
        private readonly channel: amqp.Channel,
        private readonly transactionProjection: TransactionProjection,
    ){}
    async start() {
        await this.channel.consume('transaction-approved', async msg => {
            if (!msg) return;

            const event = JSON.parse(msg.content.toString());
            await this.transactionProjection.project(event);

            this.channel.ack(msg);
        });
    }
}