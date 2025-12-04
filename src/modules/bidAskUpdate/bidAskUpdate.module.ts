import { Module } from '@nestjs/common';
import { RedisModule } from 'src/datasources/redis/redis.module';
import { BidAskUpdateListenerService } from './bidAskUpdateListener.service';

@Module({
  imports: [RedisModule],
  providers: [BidAskUpdateListenerService],
})
export class BidAskUpdateModule {}
