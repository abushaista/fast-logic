import { MiddlewareConsumer, Module } from '@nestjs/common';
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
    TransactionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorrelationIdMiddleware).forRoutes('*');
    consumer.apply(ChecksumMiddleware).forRoutes('transactions/*');
  }
}
