import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import {
  modelFromPolymarketEventDTO,
  modelFromPolymarketEventEntity,
  modelFromUnloadedPolymarketEventEntity,
  PolymarketEvent,
  PolymarketEventDTO,
  PolymarketEventEntity,
  PolymarketEventWhere,
  PolymarketUnloadedEventEntity,
} from './polymarketEvent.model';
import {
  KalshiEvent,
  KalshiEventDTO,
  KalshiEventEntity,
  KalshiEventWhere,
  modelFromKalshiEventEntity,
  modelFromKalshiEventDTO,
  KalshiUnloadedEventEntity,
  modelFromUnloadedKalshiEventEntity,
} from './kalshiEvent.model';
import { GqlWhereParsingService } from 'src/datasources/database/gqlWhereParsing.service';
import { EventType, EventWhere, LoadEventInput } from './event.interface';
import { Err, Ok, Result } from '../../helpers/helpertypes';

type EventServiceFindProps = {
  first: number;
  skip: number;
  where?: EventWhere;
};

type MergeEventsProps = {
  events: LoadEventInput[];
};

type Event = PolymarketEventEntity | KalshiEventEntity;

type MergeEventsResponse = {
  ok: boolean;
  error: string;
  events: (PolymarketEventDTO | KalshiEventDTO)[];
};

@Injectable()
export class EventService {
  constructor(
    @Inject('POLYMARKET_EVENT_REPOSITORY')
    private polymarketEventRepository: Repository<PolymarketEventEntity>,
    @Inject('KALSHI_EVENT_REPOSITORY')
    private kalshiEventRepository: Repository<KalshiEventEntity>,

    @Inject('POLYMARKET_UNLOADED_EVENT_REPOSITORY')
    private polymarketUnloadedEventRepository: Repository<PolymarketUnloadedEventEntity>,
    @Inject('KALSHI_UNLOADED_EVENT_REPOSITORY')
    private kalshiUnloadedEventRepository: Repository<KalshiUnloadedEventEntity>,

    private gqlWhereParsingService: GqlWhereParsingService,
  ) {}

  async merge({
    events,
  }: MergeEventsProps): Promise<
    Result<(PolymarketEvent | KalshiEvent)[], string>
  > {
    console.log('Sending post to merging microservice...');
    let resp: Response;
    try {
      resp = await fetch('http://localhost:1234/events/load', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          events,
        }),
      });
    } catch (e) {
      return Err(`${e}`);
    }

    console.log(resp);
    if (!resp || !resp.ok) {
      return Err('unable to fetch microservice');
    }
    const body = (await resp.json()) as MergeEventsResponse;
    console.log('Got resp', body);

    if (!body.ok) {
      return Err(`Error from api: ${body.error}`);
    }
    const resultEvents: (PolymarketEvent | KalshiEvent)[] = [];

    for (const event of body.events) {
      console.log('AAAAAAA: ', event.type, event.title);
      try {
        let model: PolymarketEvent | KalshiEvent;

        if (event.type === EventType.Polymarket.toString()) {
          model = modelFromPolymarketEventDTO(event as PolymarketEventDTO);
        } else if (event.type === EventType.Kalshi.toString()) {
          model = modelFromKalshiEventDTO(event as KalshiEventDTO);
        } else {
          throw new Error('Invalid event in response');
        }

        resultEvents.push(model);
      } catch (e) {
        return Err(`error parsing response: ${e}`);
      }
    }

    return Ok(resultEvents);
  }

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

  async findByTitlePolymarket({
    first,
    skip,
    title,
  }: {
    first: number;
    skip: number;
    title: string;
  }): Promise<PolymarketEvent[]> {
    const qb = this.polymarketUnloadedEventRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.markets', 'markets')
      .addSelect(
        `
      CASE
          WHEN event.title= :search THEN 3
          WHEN event.title ILIKE :prefix THEN 2
          WHEN event.title% :search THEN 1
          ELSE 0
      END
  `,
        'match_rank',
      )
      .addSelect(`similarity(event.title, :search)`, 'similarity_score')
      .setParameters({
        search: title,
        prefix: `${title}%`,
      })
      .orderBy('match_rank', 'DESC')
      .addOrderBy('similarity_score', 'DESC')
      .take(first)
      .skip(skip);

    const results = await qb.getRawAndEntities();
    const polymarketMarkets = results.entities
      .map((entity) => modelFromUnloadedPolymarketEventEntity(entity))
      .filter((market) => !!market);

    return polymarketMarkets;
  }

  async findByTitleKalshi({
    first,
    skip,
    title,
  }: {
    first: number;
    skip: number;
    title: string;
  }): Promise<KalshiEvent[]> {
    const qb = this.kalshiUnloadedEventRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.markets', 'markets')
      .addSelect(
        `
      CASE
          WHEN event.title = :search THEN 3
          WHEN event.title ILIKE :prefix THEN 2
          WHEN event.title % :search THEN 1
          ELSE 0
      END
  `,
        'match_rank',
      )
      .addSelect(`similarity(event.title, :search)`, 'similarity_score')
      .setParameters({
        search: title,
        prefix: `${title}%`,
      })
      .orderBy('match_rank', 'DESC')
      .addOrderBy('similarity_score', 'DESC')
      .take(first)
      .skip(skip);

    const results = await qb.getRawAndEntities();
    const kalshiMarkets = results.entities
      .map((entity) => modelFromUnloadedKalshiEventEntity(entity))
      .filter((market) => !!market);

    return kalshiMarkets;
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
        .then((entities) =>
          entities?.map((entity) => modelFromPolymarketEventEntity(entity)),
        );
    }

    const queryBuilder =
      this.polymarketEventRepository.createQueryBuilder('polymarket_events');

    const metadata = this.polymarketEventRepository.metadata;

    this.gqlWhereParsingService.parse(queryBuilder, where, metadata);

    const polymarketEvents = queryBuilder.take(first).skip(skip).getMany();

    return polymarketEvents.then((entities) =>
      entities?.map((entity) => modelFromPolymarketEventEntity(entity)),
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
        .then((entities) =>
          entities?.map((entity) => modelFromKalshiEventEntity(entity)),
        );
    }

    const queryBuilder =
      this.kalshiEventRepository.createQueryBuilder('kalshi_events');

    const metadata = this.kalshiEventRepository.metadata;

    this.gqlWhereParsingService.parse(queryBuilder, where, metadata);

    const kalshiEvents = queryBuilder.take(first).skip(skip).getMany();

    return kalshiEvents.then((entities) =>
      entities?.map((entity) => modelFromKalshiEventEntity(entity)),
    );
  }
}
