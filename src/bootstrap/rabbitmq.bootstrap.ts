import amqp from 'amqplib';

export async function createRabbitMQChannel() {
    const rabbitmqUrl = process.env.RABBITMQ_URL;
    if (!rabbitmqUrl) {
        throw new Error('RABBITMQ_URL is not defined in environment variables');
    }
    const connection = await amqp.connect(rabbitmqUrl);
    const channel = await connection.createChannel();

    await channel.assertExchange('domain-events', 'topic', { durable: true });

    return channel;
}
