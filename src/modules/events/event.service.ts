import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import {
  PolymarketEvent,
  PolymarketEventEntity,
  PolymarketEventWhere,
} from './polymarketEvent.model';
import {
  KalshiEvent,
  KalshiEventEntity,
  KalshiEventWhere,
} from './kalshiEvent.model';
import { GqlWhereParsingService } from 'src/datasources/database/gqlWhereParsing.service';
import { EventWhere } from './event.interface';

type EventServiceFindProps = {
  first: number;
  skip: number;
  where?: EventWhere;
};

@Injectable()
export class EventService {
  constructor(
    @Inject('POLYMARKET_EVENT_REPOSITORY')
    private polymarketEventRepository: Repository<PolymarketEventEntity>,
    @Inject('KALSHI_EVENT_REPOSITORY')
    private kalshiEventRepository: Repository<KalshiEventEntity>,

    private gqlWhereParsingService: GqlWhereParsingService,
  ) {}

  async find({
    first,
    skip,
    where,
  }: EventServiceFindProps): Promise<(KalshiEvent | PolymarketEvent)[]> {
    if (!where) {
      const polymarketEventsPromise = this.findPolymarketEvent({
        first,
        skip,
      });

      const kalshiEventsPromise = this.findKalshiEvent({
        first,
        skip,
      });

      const [polymarketEvents, kalshiEvents] = await Promise.all([
        polymarketEventsPromise,
        kalshiEventsPromise,
      ]);
      console.log('pol:', polymarketEvents?.length);
      console.log('kal:', kalshiEvents?.length);

      return [...polymarketEvents, ...kalshiEvents];
    }

    const polymarketEventWhere = new PolymarketEventWhere(where);
    const kalshiEventWhere = new KalshiEventWhere(where);

    const polymarketEventsPromise = this.findPolymarketEvent({
      first,
      skip,
      where: polymarketEventWhere,
    });

    const kalshiEventsPromise = this.findKalshiEvent({
      first,
      skip,
      where: kalshiEventWhere,
    });

    const [polymarketEvents, kalshiEvents] = await Promise.all([
      polymarketEventsPromise,
      kalshiEventsPromise,
    ]);
    console.log('pol:', polymarketEvents?.length);
    console.log('kal:', kalshiEvents?.length);

    return [...polymarketEvents, ...kalshiEvents];
  }

  async findPolymarketEvent({
    first,
    skip,
    where,
  }: {
    first?: number;
    skip?: number;
    where?: PolymarketEventWhere;
  }): Promise<PolymarketEvent[]> {
    if (!where) {
      return this.polymarketEventRepository
        .find({
          skip: skip,
          take: first,
        })
        .then((entities) => entities?.map((entity) => entity.toModel()));
    }

    const queryBuilder =
      this.polymarketEventRepository.createQueryBuilder('polymarket_events');

    const metadata = this.polymarketEventRepository.metadata;

    this.gqlWhereParsingService.parse(queryBuilder, where, metadata);

    const polymarketEvents = queryBuilder.take(first).skip(skip).getMany();

    return polymarketEvents.then((entities) =>
      entities?.map((entity) => entity.toModel()),
    );
  }
  async findKalshiEvent({
    first,
    skip,
    where,
  }: {
    first: number;
    skip: number;
    where?: KalshiEventWhere;
  }): Promise<KalshiEvent[]> {
    if (!where) {
      return this.kalshiEventRepository
        .find({
          skip: skip,
          take: first,
        })
        .then((entities) => entities.map((entity) => entity.toModel()));
    }

    const queryBuilder =
      this.kalshiEventRepository.createQueryBuilder('kalshi_events');

    const metadata = this.kalshiEventRepository.metadata;

    this.gqlWhereParsingService.parse(queryBuilder, where, metadata);

    const kalshiEvents = queryBuilder.take(first).skip(skip).getMany();

    return kalshiEvents.then((entities) =>
      entities?.map((entity) => entity.toModel()),
    );
  }
}
