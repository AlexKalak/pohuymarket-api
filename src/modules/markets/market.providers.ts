import { DataSource } from 'typeorm';
import { PolymarketMarketEntity } from './polymarketMarket.model';
import { KalshiMarketEntity } from './kalshiMarket.model';

export const marketProviders = [
  {
    provide: 'POLYMARKET_MARKET_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(PolymarketMarketEntity),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'KALSHI_MARKET_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(KalshiMarketEntity),
    inject: ['DATA_SOURCE'],
  },
];
