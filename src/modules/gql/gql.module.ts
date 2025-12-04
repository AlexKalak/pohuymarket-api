import { Module } from '@nestjs/common';
import { OrdersMatchModule } from '../ordersMatchModule/ordersMatch.module';
import { GQLOrdersMatchResolver } from './gql.ordersMatch.resolver';
import { PubSubModule } from 'src/events/pubSub.module';
import { GQLBidAskUpdateResolver } from './gql.bidAskUpdate.resolver';
import { BidAskUpdateModule } from '../bidAskUpdate/bidAskUpdate.module';

@Module({
  imports: [PubSubModule, OrdersMatchModule, BidAskUpdateModule],
  providers: [GQLOrdersMatchResolver, GQLBidAskUpdateResolver],
})
export class GQLModule {}
