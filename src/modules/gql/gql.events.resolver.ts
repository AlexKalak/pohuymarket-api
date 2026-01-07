import {
  Args,
  createUnionType,
  Field,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import { KalshiEvent } from '../events/kalshiEvent.model';
import { EventWhere, LoadEventInput } from '../events/event.interface';
import { PolymarketEvent } from '../events/polymarketEvent.model';
import { EventService } from '../events/event.service';
import { plainToInstance } from 'class-transformer';

const EventsUnion = createUnionType({
  name: 'EventsUnion',
  types: () => [PolymarketEvent, KalshiEvent] as const,
});

@ObjectType()
class EventsByTextResponse {
  @Field(() => [PolymarketEvent])
  polymarket: PolymarketEvent[];
  @Field(() => [KalshiEvent])
  kalshi: KalshiEvent[];
}

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

  @Query(() => EventsByTextResponse)
  async eventsByText(
    @Args('text', { type: () => String, nullable: true })
    text?: string,
    @Args('first', { type: () => Int, nullable: true })
    first: number = 100,
    @Args('skip', { type: () => Int, nullable: true })
    skip: number = 0,
  ): Promise<EventsByTextResponse> {
    if (first > 100) {
      throw new GraphQLError('Too many entities requested', {
        extensions: {
          code: 'TOO_MANY_ENTITIES',
          timestamp: new Date().toISOString(),
        },
      });
    }

    if (!text || text.length < 3) {
      return {
        polymarket: [],
        kalshi: [],
      };
    }

    const polymarketEvents = await this.eventService.findByTitlePolymarket({
      first,
      skip,
      title: text,
    });

    const kalshiEvents = await this.eventService.findByTitleKalshi({
      first,
      skip,
      title: text,
    });

    return {
      polymarket: polymarketEvents,
      kalshi: kalshiEvents,
    };
  }

  @Query(() => [EventsUnion])
  async events(
    @Args('where', { type: () => EventWhere, nullable: true })
    wherePlain?: EventWhere,
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
    const where = plainToInstance(EventWhere, wherePlain);

    const events = await this.eventService.find({
      first,
      skip,
      where,
    });

    return events;
  }
}
