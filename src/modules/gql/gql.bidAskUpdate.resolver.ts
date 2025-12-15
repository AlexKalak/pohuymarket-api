import { plainToInstance } from 'class-transformer';
import { Args, Int, Query, Resolver, Subscription } from '@nestjs/graphql';
import { BidAskUpdate, BidAskUpdateWhere } from 'src/models/bidAskUpdate.model';
import { OnEvent } from '@nestjs/event-emitter';
import { BID_ASK_EVENTS } from 'src/events/events';
import { Inject } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { PUB_SUB } from 'src/events/pubSub.module';
import { getBidAskUpdateTrigger } from './gql.triggers';
import { BidAskUpdateService } from '../bidAskUpdate/bidAskUpdate.service';

@Resolver()
export class GQLBidAskUpdateResolver {
  constructor(
    @Inject(PUB_SUB) private pubSub: PubSub,
    private bidAskUpdateService: BidAskUpdateService,
  ) {}

  @Query(() => [BidAskUpdate])
  async bestBidAskUpdates(
    @Args('fromHead', { type: () => Boolean, nullable: true })
    fromHead: boolean = true,
    @Args('where', { type: () => BidAskUpdateWhere, nullable: true })
    wherePlain?: BidAskUpdateWhere,
    @Args('first', { type: () => Int, nullable: true })
    first: number = 1000,
    @Args('skip', { type: () => Int, nullable: true })
    skip: number = 0,
  ): Promise<BidAskUpdate[]> {
    // if (first > 1000) {
    //   throw new GraphQLError('Too many entities requested', {
    //     extensions: {
    //       code: 'TOO_MANY_ENTITIES',
    //       timestamp: new Date().toISOString(),
    //     },
    //   });
    // }

    const where = plainToInstance(BidAskUpdateWhere, wherePlain);

    return this.bidAskUpdateService.find({
      first,
      skip,
      fromHead,
      where,
    });
  }

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
