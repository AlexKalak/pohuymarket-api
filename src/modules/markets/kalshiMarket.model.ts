import {
  Entity,
  Column,
  Index,
  Unique,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import {
  KalshiEvent,
  KalshiEventDTO,
  KalshiEventEntity,
  modelFromKalshiEventDTO,
  modelFromKalshiEventEntity,
} from '../events/kalshiEvent.model';

import { MarketType, MarketWhere, type IMarket } from './market.interface';
import { type IEvent } from '../events/event.interface';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { StraightParsable } from 'src/models/decorators';
import { DateScalar } from '../gql/gql.scalars';

@InputType()
export class KalshiMarketWhere {
  @Field({ nullable: true })
  @StraightParsable()
  ticker?: string;

  constructor(marketWhere: MarketWhere) {
    if (!marketWhere) {
      return;
    }

    if (marketWhere.identificator) {
      this.ticker = marketWhere.identificator;
    }
  }
}

@ObjectType()
export class KalshiMarket implements IMarket {
  @Field(() => String, { nullable: true })
  type: MarketType;

  @Field(() => String, { nullable: true })
  ticker!: string;

  @Field(() => String, { nullable: true })
  event_ticker!: string;

  @Field(() => String, { nullable: true })
  title!: string;

  @Field(() => String, { nullable: true })
  subtitle!: string;

  @Field(() => DateScalar, { nullable: true })
  createdTime!: Date;

  @Field(() => DateScalar, { nullable: true })
  closeTime!: Date;

  @Field(() => String, { nullable: true })
  yesSubtitle!: string;

  @Field(() => String, { nullable: true })
  noSubtitle!: string;

  @Field(() => String, { nullable: true })
  custom!: string;

  @Field(() => String, { nullable: true })
  marketType!: string;

  @Field(() => Boolean, { nullable: true })
  closed!: boolean;

  @Field(() => KalshiEvent, { nullable: true })
  event!: KalshiEvent;

  Downcast(): any {
    return this;
  }
  GetEvent(): IEvent {
    return this.event;
  }
  GetIsClosed(): boolean {
    return this.closed;
  }
  GetEnd(): Date {
    return this.closeTime;
  }
  GetStart(): Date {
    return this.createdTime;
  }
  GetQuestion(): string {
    return this.title;
  }
  GetTitle(): string {
    return this.title;
  }
  GetIdentificator(): string {
    return this.ticker;
  }
  GetMarketType(): MarketType {
    return this.type;
  }
}

@Entity('kalshi_markets')
@Unique(['ticker'])
export class KalshiMarketEntity {
  @Index()
  @PrimaryColumn('varchar')
  ticker!: string;

  @Index()
  @Column('varchar')
  event_ticker!: string;

  @Index()
  @Column('varchar')
  title!: string;

  @Index()
  @Column('varchar')
  subtitle!: string;

  @Column({ type: 'varchar', nullable: true })
  yesSubtitle!: string;

  @Column({ type: 'varchar', nullable: true })
  noSubtitle!: string;

  @Column({ type: 'varchar', nullable: true })
  custom!: string;

  @Column('timestamptz')
  createdTime!: Date;

  @Column('timestamptz')
  closeTime!: Date;

  @Column({ type: 'varchar' })
  marketType!: string;

  @Column({ type: 'boolean' })
  closed!: boolean;

  @ManyToOne(() => KalshiEventEntity)
  @JoinColumn({ name: 'event_ticker', referencedColumnName: 'ticker' })
  event!: KalshiEventEntity;
}

export function modelFromKalshiMarketEntity(
  entity: KalshiMarketEntity,
): KalshiMarket | undefined {
  if (!entity) {
    return undefined;
  }
  const model = new KalshiMarket();
  model.type = MarketType.Kalshi;

  model.ticker = entity.ticker;
  model.event_ticker = entity.event_ticker;
  model.title = entity.title;
  model.subtitle = entity.subtitle;

  model.yesSubtitle = entity.yesSubtitle;
  model.noSubtitle = entity.noSubtitle;
  model.custom = entity.custom;

  model.createdTime = entity.createdTime;
  model.closeTime = entity.closeTime;
  model.marketType = entity.marketType;
  model.closed = entity.closed;
  if (entity.event) {
    model.event = modelFromKalshiEventEntity(entity.event);
  }

  return model;
}

export class KalshiMarketDTO {
  ticker!: string;
  event_ticker!: string;
  title!: string;
  subtitle!: string;
  createdTime!: string;
  closeTime!: string;
  marketType!: string;
  closed!: boolean;
  event!: KalshiEventDTO;
  yesSubtitle!: string;
  noSubtitle!: string;
  custom!: string;
}

export function modelFromKalshiMarketDTO(
  dto: KalshiMarketDTO,
): KalshiMarket | undefined {
  if (!dto) {
    return undefined;
  }
  const model = new KalshiMarket();
  model.type = MarketType.Kalshi;

  model.ticker = dto.ticker;
  model.event_ticker = dto.event_ticker;
  model.title = dto.title;
  model.subtitle = dto.subtitle;
  model.createdTime = new Date(dto.createdTime);

  model.yesSubtitle = dto.yesSubtitle;
  model.noSubtitle = dto.noSubtitle;
  model.custom = dto.custom;

  model.closeTime = new Date(dto.closeTime);
  model.marketType = dto.marketType;
  model.closed = dto.closed;
  if (dto.event) {
    model.event = modelFromKalshiEventDTO(dto.event);
  }

  return model;
}

@Entity('kalshi_clob_scaning_markets')
@Unique(['id'])
export class KalshiClobScanningMarket {
  @Index()
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn()
  createdAt!: Date; // auto-set on INSERT

  @UpdateDateColumn()
  updatedAt!: Date; // auto-set on UPDATE

  @Index()
  @Column('int')
  kalshiMarketTicker!: string;

  @OneToOne(() => KalshiMarket)
  @JoinColumn({ name: 'kalshiMarketTicker', referencedColumnName: 'ticker' })
  market!: Promise<KalshiMarket>;
}
