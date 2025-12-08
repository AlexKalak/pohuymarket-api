import {
  Args,
  createUnionType,
  Int,
  Mutation,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import { KalshiEvent } from '../events/kalshiEvent.model';
import { EventWhere, LoadEventInput } from '../events/event.interface';
import { PolymarketEvent } from '../events/polymarketEvent.model';
import { EventService } from '../events/event.service';

const EventsUnion = createUnionType({
  name: 'EventsUnion',
  types: () => [PolymarketEvent, KalshiEvent] as const,
});

@Resolver()
export class GQLEventResolver {
  constructor(private readonly eventService: EventService) {}

  @Mutation(() => [EventsUnion])
  async loadEvents(
    @Args('events', { type: () => [LoadEventInput], nullable: true })
    loadEventEntities?: LoadEventInput[],
  ): Promise<Array<typeof EventsUnion>> {
    if (!loadEventEntities || !loadEventEntities.length) {
      throw new GraphQLError('invalid events');
    }

    for (const event of loadEventEntities) {
      if (event.ticker) {
        event.ticker = event.ticker.toUpperCase();
      }
    }

    const eventsResult = await this.eventService.merge({
      events: loadEventEntities,
    });

    if (!eventsResult.ok) {
      throw new GraphQLError(eventsResult.error);
    }
    console.log(eventsResult.value);

    return eventsResult.value;
  }

  @Query(() => [EventsUnion])
  async events(
    @Args('where', { type: () => EventWhere, nullable: true })
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
