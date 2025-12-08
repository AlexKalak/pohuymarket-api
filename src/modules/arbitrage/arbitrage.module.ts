import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/datasources/database/database.module';
import { arbitrageProviders } from './arbitrage.providers';
import { ArbitrageService } from './arbitrage.service';
import { MarketModule } from '../markets/market.module';

@Module({
  imports: [DatabaseModule, MarketModule],
  providers: [...arbitrageProviders, ArbitrageService],
  exports: [ArbitrageService],
})
export class ArbitrageModule {}
