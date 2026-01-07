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

import { MarketType, MarketWhere, type IMarket } from './market.interface';
import { type IEvent } from '../events/event.interface';
import {
  modelFromPolymarketEventDTO,
  modelFromPolymarketEventEntity,
  PolymarketEvent,
  PolymarketEventDTO,
  PolymarketEventEntity,
  PolymarketUnloadedEventEntity,
} from '../events/polymarketEvent.model';
import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { StraightParsable } from 'src/models/decorators';
import { DateScalar } from '../gql/gql.scalars';

@InputType()
export class PolymarketMarketWhere {
  @Field({ nullable: true })
  @StraightParsable()
  id?: number;

  constructor(marketWhere: MarketWhere) {
    if (!marketWhere) {
      return;
    }

    if (marketWhere.identificator && !isNaN(+marketWhere.identificator)) {
      this.id = +marketWhere.identificator;
    }
  }
}

@ObjectType()
export class PolymarketMarket implements IMarket {
  @Field(() => String, { nullable: true })
  type: MarketType;

  @Field(() => Int, { nullable: true })
  id!: number;

  @Field(() => String, { nullable: true })
  conditionId!: string;

  @Field(() => Int, { nullable: true })
  event_id!: number;

  @Field(() => String, { nullable: true })
  slug!: string;

  @Field(() => String, { nullable: true })
  question!: string;

  @Field(() => DateScalar, { nullable: true })
  startDate!: Date;

  @Field(() => DateScalar, { nullable: true })
  endDate!: Date;

  @Field(() => String, { nullable: true })
  image!: string;

  @Field(() => String, { nullable: true })
  icon!: string;

  @Field(() => String, { nullable: true })
  yesAssetId!: string;

  @Field(() => String, { nullable: true })
  noAssetId!: string;

  @Field(() => Boolean, { nullable: true })
  negRisk!: boolean;

  @Field(() => String, { nullable: true })
  negRiskMarketID!: string;

  @Field(() => String, { nullable: true })
  negRiskRequestID!: string;

  @Field(() => Boolean, { nullable: true })
  active!: boolean;

  @Field(() => Boolean, { nullable: true })
  closed!: boolean;

  @Field(() => PolymarketEvent, { nullable: true })
  event!: PolymarketEvent;

  Downcast() {
    return this;
  }
  GetEvent(): IEvent {
    return this.event;
  }
  GetIsClosed(): boolean {
    return this.closed;
  }
  GetEnd(): Date {
    return this.endDate;
  }
  GetStart(): Date {
    return this.startDate;
  }
  GetQuestion(): string {
    return this.question;
  }
  GetTitle(): string {
    return this.slug;
  }
  GetIdentificator(): string {
    return this.id.toString();
  }
  GetMarketType(): MarketType {
    return this.type;
  }
}

@Entity('polymarket_markets')
@Unique(['id'])
export class PolymarketMarketEntity {
  @Index()
  @PrimaryColumn('int')
  id!: number;

  @Index()
  @PrimaryColumn('varchar')
  conditionId!: string;

  @Index()
  @Column('int')
  event_id!: number;

  @Index()
  @Column('varchar')
  slug!: string;

  @Column('varchar')
  question!: string;

  @Column('timestamptz')
  startDate!: Date;

  @Column('timestamptz')
  endDate!: Date;

  @Index()
  @Column('varchar')
  image!: string;

  @Column({ type: 'varchar' })
  icon!: string;

  @Column({ type: 'varchar' })
  yesAssetId!: string;

  @Column({ type: 'varchar' })
  noAssetId!: string;

  @Column({ type: 'boolean' })
  negRisk!: boolean;

  @Column({ type: 'varchar' })
  negRiskMarketID!: string;

  @Column({ type: 'varchar' })
  negRiskRequestID!: string;

  @Column({ type: 'boolean' })
  active!: boolean;

  @Column({ type: 'boolean' })
  closed!: boolean;

  @ManyToOne(() => PolymarketEventEntity)
  @JoinColumn({ name: 'event_id', referencedColumnName: 'id' })
  event!: PolymarketEventEntity;
}

@Entity('polymarket_unloaded_markets')
@Unique(['id'])
export class PolymarketUnloadedMarketEntity {
  @Index()
  @PrimaryColumn('int')
  id!: number;

  @Index()
  @PrimaryColumn('varchar')
  conditionId!: string;

  @Index()
  @Column('int')
  event_id!: number;

  @Index()
  @Column('varchar')
  slug!: string;

  @Column('varchar')
  question!: string;

  @Column('timestamptz')
  startDate!: Date;

  @Column('timestamptz')
  endDate!: Date;

  @Index()
  @Column('varchar')
  image!: string;

  @Column({ type: 'varchar' })
  icon!: string;

  @Column({ type: 'varchar' })
  yesAssetId!: string;

  @Column({ type: 'varchar' })
  noAssetId!: string;

  @Column({ type: 'boolean' })
  negRisk!: boolean;

  @Column({ type: 'varchar' })
  negRiskMarketID!: string;

  @Column({ type: 'varchar' })
  negRiskRequestID!: string;

  @Column({ type: 'boolean' })
  active!: boolean;

  @Column({ type: 'boolean' })
  closed!: boolean;

  @ManyToOne(() => PolymarketUnloadedEventEntity)
  @JoinColumn({ name: 'event_id', referencedColumnName: 'id' })
  event!: PolymarketUnloadedEventEntity;
}

export function modelFromPolymarketMarketEntity(
  entity: PolymarketMarketEntity,
): PolymarketMarket | undefined {
  if (!entity) {
    return undefined;
  }
  const model = new PolymarketMarket();
  model.type = MarketType.Polymarket;

  model.id = entity.id;
  model.conditionId = entity.conditionId;
  model.event_id = entity.event_id;
  model.slug = entity.slug;
  model.question = entity.question;
  model.startDate = entity.startDate;
  model.endDate = entity.endDate;
  model.image = entity.image;
  model.icon = entity.icon;
  model.yesAssetId = entity.yesAssetId;
  model.noAssetId = entity.noAssetId;
  model.negRisk = entity.negRisk;
  model.negRiskMarketID = entity.negRiskMarketID;
  model.negRiskRequestID = entity.negRiskRequestID;
  model.active = entity.active;
  model.closed = entity.closed;

  if (entity.event) {
    model.event = modelFromPolymarketEventEntity(entity.event);
  }

  return model;
}

export function modelFromUnloadedPolymarketMarketEntity(
  entity: PolymarketUnloadedMarketEntity,
): PolymarketMarket | undefined {
  if (!entity) {
    return undefined;
  }
  const model = new PolymarketMarket();
  model.type = MarketType.Polymarket;

  model.id = entity.id;
  model.conditionId = entity.conditionId;
  model.event_id = entity.event_id;
  model.slug = entity.slug;
  model.question = entity.question;
  model.startDate = entity.startDate;
  model.endDate = entity.endDate;
  model.image = entity.image;
  model.icon = entity.icon;
  model.yesAssetId = entity.yesAssetId;
  model.noAssetId = entity.noAssetId;
  model.negRisk = entity.negRisk;
  model.negRiskMarketID = entity.negRiskMarketID;
  model.negRiskRequestID = entity.negRiskRequestID;
  model.active = entity.active;
  model.closed = entity.closed;

  if (entity.event) {
    model.event = modelFromPolymarketEventEntity(entity.event);
  }

  return model;
}

export type PolymarketMarketDTO = {
  id: number;
  conditionId: string;
  event_id: number;
  slug: string;
  question: string;
  startDate: string;
  endDate: string;
  image: string;
  icon: string;
  yesAssetId: string;
  noAssetId: string;
  negRisk: boolean;
  negRiskMarketID: string;
  negRiskRequestID: string;
  active: boolean;
  closed: boolean;
  event: PolymarketEventDTO;
};

export function modelFromPolymarketMarketDTO(
  entity: PolymarketMarketDTO,
): PolymarketMarket | undefined {
  if (!entity) {
    return undefined;
  }
  const model = new PolymarketMarket();
  model.type = MarketType.Polymarket;

  model.id = entity.id;
  model.conditionId = entity.conditionId;
  model.event_id = entity.event_id;
  model.slug = entity.slug;
  model.question = entity.question;
  model.startDate = new Date(entity.startDate);
  model.endDate = new Date(entity.endDate);
  model.image = entity.image;
  model.icon = entity.icon;
  model.yesAssetId = entity.yesAssetId;
  model.noAssetId = entity.noAssetId;
  model.negRisk = entity.negRisk;
  model.negRiskMarketID = entity.negRiskMarketID;
  model.negRiskRequestID = entity.negRiskRequestID;
  model.active = entity.active;
  model.closed = entity.closed;

  if (entity.event) {
    model.event = modelFromPolymarketEventDTO(entity.event);
  }

  return model;
}

@Entity('polymarket_clob_scaning_markets')
@Unique(['id'])
export class PolymarketClobScanningMarket {
  @Index()
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn()
  createdAt!: Date; // auto-set on INSERT

  @UpdateDateColumn()
  updatedAt!: Date; // auto-set on UPDATE

  @Index()
  @Column('int')
  polymarketMarketId!: number;

  @Index()
  @Column('varchar')
  polymarketMarketConditionId!: string;

  @OneToOne(() => PolymarketMarket)
  @JoinColumn({ name: 'polymarketMarketId', referencedColumnName: 'id' })
  market!: Promise<PolymarketMarket>;
}
