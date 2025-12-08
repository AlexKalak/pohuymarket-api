import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/datasources/database/database.module';
import { marketProviders } from './market.providers';
import { MarketService } from './market.service';

@Module({
  imports: [DatabaseModule],
  providers: [...marketProviders, MarketService],
  exports: [MarketService],
})
export class MarketModule {}
