import {
  Entity,
  Column,
  Index,
  Unique,
  PrimaryColumn,
  OneToMany,
} from 'typeorm';
import {
  modelFromPolymarketMarketDTO,
  modelFromPolymarketMarketEntity,
  PolymarketMarket,
  PolymarketMarketDTO,
  PolymarketMarketEntity,
} from '../markets/polymarketMarket.model';
import { type IMarket } from '../markets/market.interface';
import { EventType, EventWhere, IEvent } from './event.interface';
import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { StraightParsable } from 'src/models/decorators';
import { DateScalar } from '../gql/gql.scalars';

@InputType()
export class PolymarketEventWhere {
  @Field({ nullable: true })
  @StraightParsable()
  id?: number;

  @Field({ nullable: true })
  @StraightParsable()
  slug?: string;

  constructor(eventWhere: EventWhere) {
    if (!eventWhere) {
      return;
    }

    if (Number(eventWhere.identificator)) {
      this.id = Number(eventWhere.identificator);
    }
  }
}

@ObjectType()
export class PolymarketEvent implements IEvent {
  @Field(() => Int, { nullable: true })
  id!: number;

  @Field(() => String, { nullable: true })
  slug!: string;

  @Field(() => String, { nullable: true })
  title!: string;

  @Field(() => String, { nullable: true })
  description!: string;

  @Field(() => DateScalar, { nullable: true })
  startDate!: Date;

  @Field(() => DateScalar, { nullable: true })
  endDate!: Date;

  @Field(() => String, { nullable: true })
  image!: string;

  @Field(() => String, { nullable: true })
  icon!: string;

  @Field(() => Boolean, { nullable: true })
  negRisk!: boolean;

  @Field(() => String, { nullable: true })
  negRiskMarketID!: string;

  @Field(() => Boolean, { nullable: true })
  active!: boolean;

  @Field(() => Boolean, { nullable: true })
  closed!: boolean;

  @Field(() => Boolean, { nullable: true })
  enableOrderBook!: boolean;

  @Field(() => [PolymarketMarket], { nullable: true })
  markets!: PolymarketMarket[];

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
    return this.id.toString();
  }
  GetEventType(): EventType {
    return EventType.Polymarket;
  }
}

@Entity('polymarket_events')
@Unique(['id'])
export class PolymarketEventEntity {
  type: string = EventType.Polymarket;

  @Index()
  @PrimaryColumn('int')
  id!: number;

  @Index()
  @Column('varchar')
  slug!: string;

  @Column('varchar')
  title!: string;

  @Column('varchar')
  description!: string;

  @Index()
  @Column('timestamptz')
  startDate!: Date;

  @Index()
  @Column('timestamptz')
  endDate!: Date;

  @Index()
  @Column('varchar')
  image!: string;

  @Column({ type: 'varchar' })
  icon!: string;

  @Column({ type: 'boolean' })
  negRisk!: boolean;

  @Column({ type: 'varchar' })
  negRiskMarketID!: string;

  @Column({ type: 'boolean' })
  active!: boolean;

  @Column({ type: 'boolean' })
  closed!: boolean;

  @Column({ type: 'boolean' })
  enableOrderBook!: boolean;

  @OneToMany(() => PolymarketMarketEntity, (market) => market.event)
  markets!: PolymarketMarketEntity[];
}

export function modelFromPolymarketEventEntity(
  entity: PolymarketEventEntity,
): PolymarketEvent {
  console.log('entity', entity.title, entity.type);

  const model = new PolymarketEvent();

  model.id = entity.id;
  model.slug = entity.slug;
  model.title = entity.title;
  model.description = entity.description;
  model.startDate = entity.startDate;
  model.endDate = entity.endDate;
  model.image = entity.image;
  model.icon = entity.icon;
  model.negRisk = entity.negRisk;
  model.negRiskMarketID = entity.negRiskMarketID;
  model.active = entity.active;
  model.closed = entity.closed;
  model.enableOrderBook = entity.enableOrderBook;

  model.markets = entity.markets
    ?.map((marketEntity) => modelFromPolymarketMarketEntity(marketEntity))
    .filter((market) => !!market);

  return model;
}

export type PolymarketEventDTO = {
  type: string;
  id: number;
  slug: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  image: string;
  icon: string;
  negRisk: boolean;
  negRiskMarketID: string;
  active: boolean;
  closed: boolean;
  enableOrderBook: boolean;
  markets: PolymarketMarketDTO[];
};

export function modelFromPolymarketEventDTO(
  entity: PolymarketEventDTO,
): PolymarketEvent {
  const model = new PolymarketEvent();

  model.id = entity.id;
  model.slug = entity.slug;
  model.title = entity.title;
  model.description = entity.description;
  model.startDate = new Date(entity.startDate);
  model.endDate = new Date(entity.endDate);
  model.image = entity.image;
  model.icon = entity.icon;
  model.negRisk = entity.negRisk;
  model.negRiskMarketID = entity.negRiskMarketID;
  model.active = entity.active;
  model.closed = entity.closed;
  model.enableOrderBook = entity.enableOrderBook;

  model.markets = entity.markets
    ?.map((marketEntity) => modelFromPolymarketMarketDTO(marketEntity))
    .filter((market) => !!market);

  return model;
}
