import amqp from 'amqplib';

export async function createRabbitMQChannel() {
  const rabbitMQUrl = process.env.RABBITMQ_URL;
  if (!rabbitMQUrl) {
    throw new Error('RABBITMQ_URL environment variable is not set');
  }
  const conn = await amqp.connect(rabbitMQUrl);
  return conn.createChannel();
}
