import {
  Entity,
  Column,
  Index,
  Unique,
  PrimaryColumn,
  OneToMany,
} from 'typeorm';
import {
  PolymarketMarket,
  PolymarketMarketEntity,
} from '../markets/polymarketMarket.model';
import { type IMarket } from '../markets/market.interface';
import { EventType, EventWhere, IEvent } from './event.interface';
import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { StraightParsable } from 'src/models/decorators';

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

  @Field(() => Date, { nullable: true })
  startDate!: Date;

  @Field(() => Date, { nullable: true })
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
  GetMarkets(): Promise<IMarket[]> {
    return Promise.resolve(this.markets);
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

  toModel(): PolymarketEvent {
    const model = new PolymarketEvent();
    model.id = this.id;
    model.slug = this.slug;
    model.title = this.title;
    model.description = this.description;
    model.startDate = this.startDate;
    model.endDate = this.endDate;
    model.image = this.image;
    model.icon = this.icon;
    model.negRisk = this.negRisk;
    model.negRiskMarketID = this.negRiskMarketID;
    model.active = this.active;
    model.closed = this.closed;
    model.enableOrderBook = this.enableOrderBook;

    model.markets = this.markets?.map((marketEntity) =>
      marketEntity?.toModel(),
    );

    return model;
  }
}
