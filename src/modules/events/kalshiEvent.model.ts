import {
  Entity,
  Column,
  Index,
  Unique,
  PrimaryColumn,
  OneToMany,
} from 'typeorm';

import {
  KalshiMarket,
  KalshiMarketDTO,
  KalshiMarketEntity,
  modelFromKalshiMarketDTO,
  modelFromKalshiMarketEntity,
} from '../markets/kalshiMarket.model';

import { type IMarket } from '../markets/market.interface';

import { IEvent, EventType, EventWhere } from './event.interface';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { StraightParsable } from 'src/models/decorators';

@InputType()
export class KalshiEventWhere {
  @Field({ nullable: true })
  @StraightParsable()
  ticker?: string;

  constructor(eventWhere: EventWhere) {
    if (!eventWhere) {
      return;
    }

    this.ticker = eventWhere.identificator;
  }
}

@ObjectType()
export class KalshiEvent implements IEvent {
  @Field(() => String, { nullable: true })
  ticker!: string;

  @Field(() => String, { nullable: true })
  title!: string;

  @Field(() => [KalshiMarket], { nullable: true })
  markets!: KalshiMarket[];

  Downcast() {
    return this;
  }
  GetMarkets(): IMarket[] {
    return this.markets;
  }
  GetTitle(): string {
    return this.title;
  }
  GetIdentificator(): string {
    return this.ticker;
  }
  GetEventType(): EventType {
    return EventType.Kalshi;
  }
}

@Entity('kalshi_events')
@Unique(['ticker'])
export class KalshiEventEntity {
  type: string = EventType.Kalshi;

  @Index()
  @PrimaryColumn('varchar')
  ticker!: string;

  @Column('varchar')
  title!: string;

  @OneToMany(() => KalshiMarketEntity, (market) => market.event)
  markets!: KalshiMarketEntity[];
}

export function modelFromKalshiEventEntity(
  entity: KalshiEventEntity,
): KalshiEvent {
  const model = new KalshiEvent();
  model.ticker = entity.ticker;
  model.title = entity.title;
  model.markets = entity.markets
    ?.map((marketEntity) => modelFromKalshiMarketEntity(marketEntity))
    .filter((market) => !!market);

  return model;
}

export type KalshiEventDTO = {
  type: string;
  ticker: string;
  title: string;
  markets: KalshiMarketDTO[];
};

export function modelFromKalshiEventDTO(entity: KalshiEventDTO): KalshiEvent {
  const model = new KalshiEvent();
  model.ticker = entity.ticker;
  model.title = entity.title;
  model.markets = entity.markets
    ?.map((marketEntity) => modelFromKalshiMarketDTO(marketEntity))
    .filter((market) => !!market);

  return model;
}
