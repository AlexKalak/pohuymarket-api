import { DataSource } from 'typeorm';
import { KalshiOrderEntity, KalshiOrderFillEntity, PolymarketOrderEntity, PolymarketOrderFillEntity } from './orders.model';

export const orderProviders = [
  {
    provide: 'POLYMARKET_ORDERS_REPO',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(PolymarketOrderEntity),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'KALSHI_ORDERS_REPO',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(KalshiOrderEntity),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'POLYMARKET_ORDER_FILLS_REPO',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(PolymarketOrderFillEntity),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'KALSHI_ORDER_FILLS_REPO',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(KalshiOrderFillEntity),
    inject: ['DATA_SOURCE'],
  },
];
