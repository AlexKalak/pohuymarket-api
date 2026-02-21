import { DataSource } from 'typeorm';
import {
  PolymarketEventEntity,
  PolymarketUnloadedEventEntity,
} from './polymarketEvent.model';
import {
  KalshiEventEntity,
  KalshiUnloadedEventEntity,
} from './kalshiEvent.model';
import { PredictFunEventEntity, PredictFunUnloadedEventEntity } from './predictFunEvent.model';

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
  {
    provide: 'PREDICT_FUN_EVENT_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(PredictFunEventEntity),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'POLYMARKET_UNLOADED_EVENT_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(PolymarketUnloadedEventEntity),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'KALSHI_UNLOADED_EVENT_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(KalshiUnloadedEventEntity),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'PREDICT_FUN_UNLOADED_EVENT_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(PredictFunUnloadedEventEntity),
    inject: ['DATA_SOURCE'],
  },
];
