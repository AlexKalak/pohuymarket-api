import { Provider } from '@nestjs/common';
import { BidAskUpdateEntity } from 'src/models/bidAskUpdate.model';
import { OrdersMatch } from 'src/models/ordersMatch.model';
import { ArbitragePairEntity } from 'src/modules/arbitrage/arbitragePairs.model';
import {
  KalshiEventEntity,
  KalshiUnloadedEventEntity,
} from 'src/modules/events/kalshiEvent.model';
import {
  PolymarketEventEntity,
  PolymarketUnloadedEventEntity,
} from 'src/modules/events/polymarketEvent.model';
import {
  KalshiMarketEntity,
  KalshiUnloadedMarketEntity,
} from 'src/modules/markets/kalshiMarket.model';
import {
  PolymarketMarketEntity,
  PolymarketUnloadedMarketEntity,
} from 'src/modules/markets/polymarketMarket.model';
import { DataSource } from 'typeorm';

export const databaseProviders: Provider[] = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: '12341234',
        database: 'pohuymarket',
        entities: [
          OrdersMatch,
          PolymarketUnloadedEventEntity,
          PolymarketEventEntity,
          PolymarketUnloadedMarketEntity,
          PolymarketMarketEntity,
          KalshiUnloadedEventEntity,
          KalshiEventEntity,
          KalshiMarketEntity,
          KalshiUnloadedMarketEntity,
          ArbitragePairEntity,
          BidAskUpdateEntity,
        ],
        synchronize: false, // ❌ very important, don’t let TypeORM change schema
      });

      return dataSource.initialize();
    },
  },
];
