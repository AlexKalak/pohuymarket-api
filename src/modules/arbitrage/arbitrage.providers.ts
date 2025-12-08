import { DataSource } from 'typeorm';
import { ArbitragePairEntity } from './arbitragePairs.model';

export const arbitrageProviders = [
  {
    provide: 'ARBITRAGE_PAIRS_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(ArbitragePairEntity),
    inject: ['DATA_SOURCE'],
  },
];
