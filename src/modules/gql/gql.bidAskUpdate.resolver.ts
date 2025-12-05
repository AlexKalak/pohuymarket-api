import { Args, Resolver, Subscription } from '@nestjs/graphql';
import { BidAskUpdate } from 'src/models/bidAskUpdate.model';
import { OnEvent } from '@nestjs/event-emitter';
import { BID_ASK_EVENTS } from 'src/events/events';
import { Inject } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { PUB_SUB } from 'src/events/pubSub.module';
import { getBidAskUpdateTrigger } from './gql.triggers';

@Resolver()
export class GQLBidAskUpdateResolver {
  constructor(@Inject(PUB_SUB) private pubSub: PubSub) {}

  // @Query(() => [BidAskUpdate])
  // async bidAskUpdates(
  //   @Args('fromHead', { type: () => Boolean, nullable: true })
  //   fromHead: boolean = true,
  //   @Args('where', { type: () => OrdersMatchWhere, nullable: true })
  //   where?: BidAskUpdateWhere,
  //   @Args('first', { type: () => Int, nullable: true })
  //   first: number = 1000,
  //   @Args('skip', { type: () => Int, nullable: true })
  //   skip: number = 0,
  // ): Promise<OrdersMatch[]> {
  //   if (first > 1000) {
  //     throw new GraphQLError('Too many entities requested', {
  //       extensions: {
  //         code: 'TOO_MANY_ENTITIES',
  //         timestamp: new Date().toISOString(),
  //       },
  //     });
  //   }
  //
  //   return this.ordersMatchService.find({
  //     first,
  //     skip,
  //     fromHead,
  //     where,
  //   });
  // }

  @OnEvent(BID_ASK_EVENTS.BidAskUpdateEvent)
  async hanleSwapEvent(bidAskUpdate: BidAskUpdate) {
    console.log('Got event: ', bidAskUpdate);
    await this.pubSub.publish(
      getBidAskUpdateTrigger(bidAskUpdate.marketIdentificator),
      {
        bidAskUpdate: bidAskUpdate,
      },
    );
  }
  @Subscription(() => BidAskUpdate, {})
  bidAskUpdate(
    @Args('marketIdentificator', { type: () => String })
    marketIdentificator: string,
  ) {
    return this.pubSub.asyncIterableIterator(
      getBidAskUpdateTrigger(marketIdentificator),
    );
  }
}
