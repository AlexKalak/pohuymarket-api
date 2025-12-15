import { DataSource } from 'typeorm';
import { BidAskUpdateEntity } from 'src/models/bidAskUpdate.model';

export const bidAskProviders = [
  {
    provide: 'BID_ASK_UPDATE_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(BidAskUpdateEntity),
    inject: ['DATA_SOURCE'],
  },
];
