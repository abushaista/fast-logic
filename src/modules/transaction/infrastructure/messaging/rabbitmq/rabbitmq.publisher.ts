import { EventBusPort } from "src/modules/transaction/application/ports/event-bus.port";
import { DomainEvent } from "src/shared/kernel/domain-event";
import amqp from 'amqplib'

export class RabbitMQPublisher implements EventBusPort {
    constructor(private readonly channel: amqp.Channel){}
    async publish(events: DomainEvent[]): Promise<void> {
        for (const event of events) {
            this.channel.publish(
                'domain-events',
                event.getEventName(),
                Buffer.from(JSON.stringify(event)),
            );
        }
    }

}