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
  KalshiMarketEntity,
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
  GetMarkets(): Promise<IMarket[]> {
    return Promise.resolve(this.markets ?? []);
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
  @Index()
  @PrimaryColumn('varchar')
  ticker!: string;

  @Column('varchar')
  title!: string;

  @OneToMany(() => KalshiMarketEntity, (market) => market.event)
  markets!: KalshiMarketEntity[];

  toModel(): KalshiEvent {
    const model = new KalshiEvent();
    model.ticker = this.ticker;
    model.title = this.title;
    model.markets = this.markets?.map((marketEntity) =>
      marketEntity?.toModel(),
    );
    return model;
  }
}
