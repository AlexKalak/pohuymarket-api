import { Provider } from '@nestjs/common';
import { OrdersMatch } from 'src/models/ordersMatch.model';
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
        entities: [OrdersMatch],
        synchronize: false, // ❌ very important, don’t let TypeORM change schema
      });

      return dataSource.initialize();
    },
  },
];
