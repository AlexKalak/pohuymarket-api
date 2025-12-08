import { Module } from '@nestjs/common';
import { OrdersMatchModule } from '../ordersMatchModule/ordersMatch.module';
import { GQLOrdersMatchResolver } from './gql.ordersMatch.resolver';
import { PubSubModule } from 'src/events/pubSub.module';
import { GQLBidAskUpdateResolver } from './gql.bidAskUpdate.resolver';
import { BidAskUpdateModule } from '../bidAskUpdate/bidAskUpdate.module';
import { GQLEventResolver } from './gql.events.resolver';
import { EventModule } from '../events/event.module';
import { MarketModule } from '../markets/market.module';
import { GQLMarketResolver } from './gql.markets.resolver';
import { ArbitrageModule } from '../arbitrage/arbitrage.module';
import { GQLArbitrageResolver } from './gql.arbitrage.resolver';

@Module({
  imports: [
    PubSubModule,
    OrdersMatchModule,
    BidAskUpdateModule,
    EventModule,
    MarketModule,
    ArbitrageModule,
  ],
  providers: [
    GQLOrdersMatchResolver,
    GQLBidAskUpdateResolver,
    GQLEventResolver,
    GQLMarketResolver,
    GQLArbitrageResolver,
  ],
})
export class GQLModule {}
