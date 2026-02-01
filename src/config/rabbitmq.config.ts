import { registerAs } from '@nestjs/config';

export default registerAs('rabbitmq', () => ({
  url: process.env.RABBITMQ_URL,

  exchange: process.env.RABBITMQ_EXCHANGE,
  exchangeType: 'topic',

  queues: {
    domainEvents: 'domain.events.queue',
    transactionSaga: 'transaction.saga.queue',
  },

  routingKeys: {
    organization: 'organization.*',
    card: 'card.*',
    transaction: 'transaction.*',
  },

  retry: {
    attempts: 5,
    delay: 3000,
  },
}));
