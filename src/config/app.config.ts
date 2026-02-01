import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  name: process.env.APP_NAME,
  env: process.env.NODE_ENV,
  port: Number(process.env.APP_PORT),

  logLevel: process.env.LOG_LEVEL,

  isProduction: process.env.NODE_ENV === 'production',
}));
