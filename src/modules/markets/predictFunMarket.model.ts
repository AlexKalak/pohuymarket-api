import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn, Unique } from "typeorm"
import { IMarket, MarketType } from "./market.interface"
import { PredictFunEvent, PredictFunEventEntity, modelFromPredictFunEventEntity, PredictFunUnloadedEventEntity, modelFromPredictFunUnloadedEventEntity } from "../events/predictFunEvent.model"
import { IEvent } from "../events/event.interface"
import { Field, Int, ObjectType } from "@nestjs/graphql"
import { DateScalar } from "../gql/gql.scalars"

export type PredictFunOutcome = {
  name: string
  indexSet: number
  onChainId: string
  status: string
}

@ObjectType()
export class PredictFunOutcomeModel {
  constructor(outcome: PredictFunOutcomeModel) {
    this.name = outcome.name
    this.indexSet = outcome.indexSet
    this.onChainId = outcome.onChainId
    this.status = outcome.status
  }

  @Field(() => String, { nullable: true })
  name: string
  @Field(() => Int, { nullable: true })
  indexSet: number
  @Field(() => String, { nullable: true })
  onChainId: string
  @Field(() => String, { nullable: true })
  status: string
}

@ObjectType()
export class PredictFunMarket implements IMarket {
  @Field(() => String, { nullable: true })
  id!: string

  @Field(() => String, { nullable: true })
  event_id!: string

  @Field(() => String, { nullable: true })
  title!: string

  @Field(() => String, { nullable: true })
  question!: string

  @Field(() => String, { nullable: true })
  description!: string

  @Field(() => String, { nullable: true })
  imageUrl!: string

  @Field(() => String, { nullable: true })
  status!: string

  @Field(() => Boolean, { nullable: true })
  isNegRisk!: boolean

  @Field(() => Boolean, { nullable: true })
  isYieldBearing!: boolean

  @Field(() => String, { nullable: true })
  conditionId!: string

  @Field(() => String, { nullable: true })
  oracleQuestionId!: string

  @Field(() => String, { nullable: true })
  resolverAddress!: string

  @Field(() => String, { nullable: true })
  feeRateBps!: string

  @Field(() => String, { nullable: true })
  spreadThreshold!: string

  @Field(() => String, { nullable: true })
  shareThreshold!: string

  @Field(() => String, { nullable: true })
  decimalPrecision!: number

  @Field(() => Boolean, { nullable: true })
  isBoosted!: boolean

  @Field(() => DateScalar, { nullable: true })
  boostStartsAt!: Date | null

  @Field(() => DateScalar, { nullable: true })
  boostEndsAt!: Date | null

  @Field(() => String, { nullable: true })
  marketVariant!: string

  @Field(() => String, { nullable: true })
  categorySlug!: string

  @Field(() => DateScalar, { nullable: true })
  createdAt!: Date

  @Field(() => [PredictFunOutcomeModel], { nullable: true })
  outcomes!: PredictFunOutcomeModel[]

  @Field(() => String, { nullable: true })
  polymarketConditionIds!: string

  @Column('varchar', { nullable: true })
  kalshiMarketTicker!: string

  @ManyToOne(() => PredictFunEvent)
  @JoinColumn({ name: 'event_id', referencedColumnName: 'id' })
  event!: PredictFunEvent

  Downcast() {
    return this
  }

  GetEvent(): IEvent {
    return this.event
  }

  GetIsClosed(): boolean {
    return this.status === 'RESOLVED'
  }
  GetEnd(): Date {
    return this.createdAt
  }
  GetStart(): Date {
    return this.createdAt
  }
  GetQuestion(): string {
    return this.question
  }
  GetTitle(): string {
    return this.title
  }
  GetIdentificator(): string {
    return this.id
  }
  GetMarketType(): MarketType {
    return MarketType.PredictFun
  }
}

@Entity('predict_fun_markets')
@Unique(["id"])
export class PredictFunMarketEntity implements IMarket {
  @Index()
  @PrimaryColumn('varchar')
  id!: string

  @Index()
  @Column('varchar')
  event_id!: string

  @Column('varchar')
  title!: string

  @Column('varchar')
  question!: string

  @Column('varchar', { nullable: true })
  description!: string

  @Column('varchar', { nullable: true })
  imageUrl!: string

  @Column('varchar')
  status!: string

  @Column({ type: 'boolean' })
  isNegRisk!: boolean

  @Column({ type: 'boolean' })
  isYieldBearing!: boolean

  @Column('varchar')
  conditionId!: string

  @Column('varchar', { nullable: true })
  oracleQuestionId!: string

  @Column('varchar', { nullable: true })
  resolverAddress!: string

  @Column('varchar')
  feeRateBps!: string

  @Column('varchar', { nullable: true })
  spreadThreshold!: string

  @Column('varchar', { nullable: true })
  shareThreshold!: string

  @Column('int', { nullable: true })
  decimalPrecision!: number

  @Column({ type: 'boolean' })
  isBoosted!: boolean

  @Column('timestamptz', { nullable: true })
  boostStartsAt!: Date | null

  @Column('timestamptz', { nullable: true })
  boostEndsAt!: Date | null

  @Column('varchar')
  marketVariant!: string

  @Column('varchar')
  categorySlug!: string

  @Column('timestamptz')
  createdAt!: Date

  @Column('jsonb', { nullable: true })
  outcomes!: PredictFunOutcome[]

  @Column('varchar', { nullable: true })
  polymarketConditionIds!: string

  @Column('varchar', { nullable: true })
  kalshiMarketTicker!: string

  @ManyToOne(() => PredictFunEventEntity)
  @JoinColumn({ name: 'event_id', referencedColumnName: 'id' })
  event!: PredictFunEventEntity

  Downcast() {
    return this
  }

  GetEvent(): IEvent {
    return this.event
  }

  GetIsClosed(): boolean {
    return this.status === 'RESOLVED'
  }
  GetEnd(): Date {
    return this.createdAt
  }
  GetStart(): Date {
    return this.createdAt
  }
  GetQuestion(): string {
    return this.question
  }
  GetTitle(): string {
    return this.title
  }
  GetIdentificator(): string {
    return this.id
  }
  GetMarketType(): MarketType {
    return MarketType.PredictFun
  }
}

export function modelFromPredictFunMarketEntity(
  entity: PredictFunMarketEntity | undefined,
): PredictFunMarket | undefined {
  if (!entity) {
    return undefined
  }

  const model = new PredictFunMarket()

  model.id = entity.id
  model.event_id = entity.event_id
  model.title = entity.title
  model.question = entity.question
  model.description = entity.description
  model.imageUrl = entity.imageUrl
  model.status = entity.status
  model.isNegRisk = entity.isNegRisk
  model.isYieldBearing = entity.isYieldBearing
  model.conditionId = entity.conditionId
  model.oracleQuestionId = entity.oracleQuestionId
  model.resolverAddress = entity.resolverAddress
  model.feeRateBps = entity.feeRateBps
  model.spreadThreshold = entity.spreadThreshold
  model.shareThreshold = entity.shareThreshold
  model.decimalPrecision = entity.decimalPrecision
  model.isBoosted = entity.isBoosted
  model.boostStartsAt = entity.boostStartsAt
  model.boostEndsAt = entity.boostEndsAt
  model.marketVariant = entity.marketVariant
  model.categorySlug = entity.categorySlug
  model.createdAt = entity.createdAt

  model.outcomes = entity.outcomes
    ? entity.outcomes.map(o => new PredictFunOutcomeModel(o))
    : []


  model.polymarketConditionIds = entity.polymarketConditionIds
  model.kalshiMarketTicker = entity.kalshiMarketTicker

  const modelEvent = modelFromPredictFunEventEntity(entity.event)
  if (modelEvent) {
    model.event = modelEvent
  }

  return model
}

@Entity('predict_fun_unloaded_markets')
@Unique(["id"])
export class PredictFunUnloadedMarketEntity implements IMarket {
  @Index()
  @PrimaryColumn('varchar')
  id!: string

  @Index()
  @Column('varchar')
  event_id!: string

  @Column('varchar')
  title!: string

  @Column('varchar')
  question!: string

  @Column('varchar', { nullable: true })
  description!: string

  @Column('varchar', { nullable: true })
  imageUrl!: string

  @Column('varchar')
  status!: string

  @Column({ type: 'boolean' })
  isNegRisk!: boolean

  @Column({ type: 'boolean' })
  isYieldBearing!: boolean

  @Column('varchar')
  conditionId!: string

  @Column('varchar', { nullable: true })
  oracleQuestionId!: string

  @Column('varchar', { nullable: true })
  resolverAddress!: string

  @Column('varchar')
  feeRateBps!: string

  @Column('varchar', { nullable: true })
  spreadThreshold!: string

  @Column('varchar', { nullable: true })
  shareThreshold!: string

  @Column('int', { nullable: true })
  decimalPrecision!: number

  @Column({ type: 'boolean' })
  isBoosted!: boolean

  @Column('timestamptz', { nullable: true })
  boostStartsAt!: Date | null

  @Column('timestamptz', { nullable: true })
  boostEndsAt!: Date | null

  @Column('varchar')
  marketVariant!: string

  @Column('varchar')
  categorySlug!: string

  @Column('timestamptz')
  createdAt!: Date

  @Column('jsonb', { nullable: true })
  outcomes!: PredictFunOutcome[]

  @Column('varchar', { nullable: true })
  polymarketConditionIds!: string

  @Column('varchar', { nullable: true })
  kalshiMarketTicker!: string

  @ManyToOne(() => PredictFunEventEntity)
  @JoinColumn({ name: 'event_id', referencedColumnName: 'id' })
  event!: PredictFunUnloadedEventEntity

  Downcast() {
    return this
  }

  GetEvent(): IEvent {
    return this.event
  }

  GetIsClosed(): boolean {
    return this.status === 'RESOLVED'
  }
  GetEnd(): Date {
    return this.createdAt
  }
  GetStart(): Date {
    return this.createdAt
  }
  GetQuestion(): string {
    return this.question
  }
  GetTitle(): string {
    return this.title
  }
  GetIdentificator(): string {
    return this.id
  }
  GetMarketType(): MarketType {
    return MarketType.PredictFun
  }
}


export function modelFromPredictFunUnloadedMarketEntity(
  entity: PredictFunUnloadedMarketEntity | undefined,
): PredictFunMarket | undefined {
  if (!entity) {
    return undefined
  }

  const model = new PredictFunMarket()

  model.id = entity.id
  model.event_id = entity.event_id
  model.title = entity.title
  model.question = entity.question
  model.description = entity.description
  model.imageUrl = entity.imageUrl
  model.status = entity.status
  model.isNegRisk = entity.isNegRisk
  model.isYieldBearing = entity.isYieldBearing
  model.conditionId = entity.conditionId
  model.oracleQuestionId = entity.oracleQuestionId
  model.resolverAddress = entity.resolverAddress
  model.feeRateBps = entity.feeRateBps
  model.spreadThreshold = entity.spreadThreshold
  model.shareThreshold = entity.shareThreshold
  model.decimalPrecision = entity.decimalPrecision
  model.isBoosted = entity.isBoosted
  model.boostStartsAt = entity.boostStartsAt
  model.boostEndsAt = entity.boostEndsAt
  model.marketVariant = entity.marketVariant
  model.categorySlug = entity.categorySlug
  model.createdAt = entity.createdAt

  model.outcomes = entity.outcomes
    ? entity.outcomes.map(o => new PredictFunOutcomeModel(o))
    : []


  model.polymarketConditionIds = entity.polymarketConditionIds
  model.kalshiMarketTicker = entity.kalshiMarketTicker

  const modelEvent = modelFromPredictFunUnloadedEventEntity(entity.event)
  if (modelEvent) {
    model.event = modelEvent
  }

  return model
}
