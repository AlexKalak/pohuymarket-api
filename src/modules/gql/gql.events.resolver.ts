import { Args, createUnionType, Int, Query, Resolver } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import { OrdersMatchWhere } from 'src/models/ordersMatch.model';
import { KalshiEvent } from '../events/kalshiEvent.model';
import { EventWhere } from '../events/event.interface';
import { PolymarketEvent } from '../events/polymarketEvent.model';
import { EventService } from '../events/event.service';

const EventsUnion = createUnionType({
  name: 'EventsUnion',
  types: () => [PolymarketEvent, KalshiEvent] as const,
});

@Resolver()
export class GQLEventResolver {
  constructor(private readonly eventService: EventService) {}

  @Query(() => [EventsUnion])
  async events(
    @Args('where', { type: () => OrdersMatchWhere, nullable: true })
    where?: EventWhere,
    @Args('first', { type: () => Int, nullable: true })
    first: number = 1000,
    @Args('skip', { type: () => Int, nullable: true })
    skip: number = 0,
  ): Promise<Array<typeof EventsUnion>> {
    if (first > 1000) {
      throw new GraphQLError('Too many entities requested', {
        extensions: {
          code: 'TOO_MANY_ENTITIES',
          timestamp: new Date().toISOString(),
        },
      });
    }

    const events = await this.eventService.find({
      first,
      skip,
      where,
    });

    return events;
  }
}
