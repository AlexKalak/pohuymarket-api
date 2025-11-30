import { OrdersMatch } from 'src/models/ordersMatch.model';
import { DataSource } from 'typeorm';

export const ordersMatchProviders = [
  {
    provide: 'ORDERS_MATCH_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(OrdersMatch),
    inject: ['DATA_SOURCE'],
  },
];
