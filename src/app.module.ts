import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransactionModule } from './modules/transaction/transaction.module';
import { ConfigModule } from '@nestjs/config';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import rabbitmqConfig from './config/rabbitmq.config';
import redisConfig from './config/redis.config';
import { envValidationSchema } from './config/env.validation';
import { CorrelationIdMiddleware } from './shared/middleware/correlation-id.middleware';
import { ChecksumMiddleware } from './shared/middleware/checksum.middleware';
import { createPostgresPool } from './bootstrap/database.bootstrap';
import { createRedisClient } from './bootstrap/redis.bootstrap';
import { createRabbitMQChannel } from './bootstrap/rabbitmq.bootstrap';
import { Pool } from 'pg';
import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { OrganizationModule } from './modules/organization/organization.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidationSchema,
      envFilePath: [
        '.env.local',
        '.env',
        `.env.${process.env.NODE_ENV || 'development'}`,
      ],
      load: [
        appConfig,
        databaseConfig,
        rabbitmqConfig,
        redisConfig
      ],
    }),
    InfrastructureModule,
    TransactionModule,
    OrganizationModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorrelationIdMiddleware).forRoutes({
      path: 'transactions',
      method: RequestMethod.ALL
    }, {
      path: 'card',
      method: RequestMethod.ALL
    },
      {
        path: 'organization',
        method: RequestMethod.ALL
      });
    consumer.apply(ChecksumMiddleware).forRoutes({
      path: 'transactions',
      method: RequestMethod.POST
    });
  }
}
