import Redis from 'ioredis';
import { Provider } from '@nestjs/common';

export const REDIS_CLIENT = 'REDIS_CLIENT';
export const redisProviders: Provider[] = [
  {
    provide: REDIS_CLIENT,
    useFactory(): Redis {
      const redisClient = new Redis('localhost:6379');
      return redisClient;
    },
  },
];
