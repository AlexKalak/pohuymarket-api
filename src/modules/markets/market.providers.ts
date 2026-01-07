import { DataSource } from 'typeorm';
import {
  PolymarketMarketEntity,
  PolymarketUnloadedMarketEntity,
} from './polymarketMarket.model';
import {
  KalshiMarketEntity,
  KalshiUnloadedMarketEntity,
} from './kalshiMarket.model';

export const marketProviders = [
  {
    provide: 'POLYMARKET_MARKET_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(PolymarketMarketEntity),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'POLYMARKET_UNLOADED_MARKET_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(PolymarketUnloadedMarketEntity),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'KALSHI_MARKET_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(KalshiMarketEntity),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'KALSHI_UNLOADED_MARKET_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(KalshiUnloadedMarketEntity),
    inject: ['DATA_SOURCE'],
  },
];
