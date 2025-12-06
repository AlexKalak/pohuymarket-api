import { DataSource } from 'typeorm';
import { PolymarketEventEntity } from './polymarketEvent.model';
import { KalshiEventEntity } from './kalshiEvent.model';

export const eventProviders = [
  {
    provide: 'POLYMARKET_EVENT_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(PolymarketEventEntity),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'KALSHI_EVENT_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(KalshiEventEntity),
    inject: ['DATA_SOURCE'],
  },
];
