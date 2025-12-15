import { Provider } from '@nestjs/common';
import { BidAskUpdateEntity } from 'src/models/bidAskUpdate.model';
import { OrdersMatch } from 'src/models/ordersMatch.model';
import { ArbitragePairEntity } from 'src/modules/arbitrage/arbitragePairs.model';
import { KalshiEventEntity } from 'src/modules/events/kalshiEvent.model';
import { PolymarketEventEntity } from 'src/modules/events/polymarketEvent.model';
import { KalshiMarketEntity } from 'src/modules/markets/kalshiMarket.model';
import { PolymarketMarketEntity } from 'src/modules/markets/polymarketMarket.model';
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
          PolymarketEventEntity,
          PolymarketMarketEntity,
          KalshiEventEntity,
          KalshiMarketEntity,
          ArbitragePairEntity,
          BidAskUpdateEntity,
        ],
        synchronize: false, // ❌ very important, don’t let TypeORM change schema
      });

      return dataSource.initialize();
    },
  },
];
