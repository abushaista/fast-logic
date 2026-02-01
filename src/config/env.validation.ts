import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'test', 'production')
    .default('development'),

  APP_NAME: Joi.string().default('transaction-service'),
  APP_PORT: Joi.number().default(3000),

  DATABASE_URL: Joi.string().required(),

  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().default(6379),
  REDIS_PASSWORD: Joi.string().optional(),

  RABBITMQ_URL: Joi.string().required(),
  RABBITMQ_EXCHANGE: Joi.string().default('domain.events'),

  LOG_LEVEL: Joi.string()
    .valid('debug', 'info', 'warn', 'error')
    .default('info'),
});
