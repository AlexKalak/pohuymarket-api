import { Module } from '@nestjs/common';
import { RedisModule } from 'src/datasources/redis/redis.module';
import { BidAskUpdateListenerService } from './bidAskUpdateListener.service';
import { bidAskProviders } from './bidAskUpdate.providers';
import { DatabaseModule } from 'src/datasources/database/database.module';
import { BidAskUpdateService } from './bidAskUpdate.service';

@Module({
  imports: [DatabaseModule, RedisModule],
  providers: [
    ...bidAskProviders,
    BidAskUpdateListenerService,
    BidAskUpdateService,
  ],
  exports: [BidAskUpdateService],
})
export class BidAskUpdateModule {}
