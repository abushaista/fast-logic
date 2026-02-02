import { EventBusPort } from "src/modules/transaction/application/ports/event-bus.port";
import { DomainEvent } from "src/shared/kernel/domain-event";
import amqp from 'amqplib'
import { DOMAIN_EVENTS_EXCHANGE, RABBITMQ_CHANNEL } from "./rabbitmq.constants";
import { Injectable } from "@nestjs/common/decorators/core/injectable.decorator";
import { Inject } from "@nestjs/common/decorators/core/inject.decorator";

@Injectable()
export class RabbitMQPublisher implements EventBusPort {
    constructor(
        @Inject(RABBITMQ_CHANNEL)
        private readonly channel: amqp.Channel,
    ) { }
    async publish(events: DomainEvent[]): Promise<void> {
        for (const event of events) {
            this.channel.publish(
                DOMAIN_EVENTS_EXCHANGE,
                event.getEventName(),
                Buffer.from(JSON.stringify(event)),
                {
                    persistent: true,
                    contentType: 'application/json',
                }
            );
        }
    }

}