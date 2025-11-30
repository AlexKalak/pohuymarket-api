import { Module } from '@nestjs/common';
import { OrdersMatchModule } from '../ordersMatchModule/ordersMatch.module';
import { GQLOrdersMatchResolver } from './gql.ordersMatch.resolver';

@Module({
  imports: [OrdersMatchModule],
  providers: [GQLOrdersMatchResolver],
})
export class GQLModule {}
