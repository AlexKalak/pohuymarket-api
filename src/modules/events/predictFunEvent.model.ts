import { Column, Entity, Index, OneToMany, PrimaryColumn, Unique } from "typeorm"
import { EventType, IEvent } from "./event.interface"
import { PredictFunMarket, PredictFunMarketEntity, modelFromPredictFunMarketEntity, PredictFunUnloadedMarketEntity, modelFromPredictFunUnloadedMarketEntity } from "../markets/predictFunMarket.model"
import { IMarket } from "../markets/market.interface"
import { Field, Int, ObjectType } from "@nestjs/graphql"
import { DateScalar } from "../gql/gql.scalars"

@ObjectType()
export class PredictFunEvent implements IEvent {
  @Field(() => Int, { nullable: true })
  id!: number

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

  @Field(() => String, { nullable: true })
  conditionId!: string

  @Field(() => String, { nullable: true })
  categorySlug!: string

  @Field(() => DateScalar, { nullable: true })
  createdAt!: Date

  @Field(() => [PredictFunMarket], { nullable: true })
  markets!: PredictFunMarket[];

  Downcast() {
    return this
  }

  GetMarkets(): IMarket[] {
    return this.markets
  }

  GetTitle(): string {
    return this.title
  }
  GetIdentificator(): string {
    return this.id.toString()
  }
  GetEventType(): EventType {
    return EventType.PredictFun
  }
}

@Entity('predict_fun_events')
@Unique(["id"])
export class PredictFunEventEntity implements IEvent {
  type: string = EventType.PredictFun

  @Index()
  @PrimaryColumn('int')
  id!: number

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

  @Column('varchar')
  conditionId!: string

  @Column('varchar')
  categorySlug!: string

  @Column('timestamptz')
  createdAt!: Date

  @OneToMany(() => PredictFunMarketEntity, (market) => market.event)
  markets!: PredictFunMarketEntity[];

  Downcast() {
    return this
  }

  GetMarkets(): IMarket[] {
    return this.markets
  }

  GetTitle(): string {
    return this.title
  }
  GetIdentificator(): string {
    return this.id.toString()
  }
  GetEventType(): EventType {
    return EventType.PredictFun
  }
}


export function modelFromPredictFunEventEntity(
  entity: PredictFunEventEntity | undefined,
): PredictFunEvent | undefined {
  if (!entity) {
    return undefined
  }

  const model = new PredictFunEvent()

  model.id = entity.id
  model.title = entity.title
  model.question = entity.question
  model.description = entity.description
  model.imageUrl = entity.imageUrl
  model.status = entity.status
  model.isNegRisk = entity.isNegRisk
  model.conditionId = entity.conditionId
  model.categorySlug = entity.categorySlug
  model.createdAt = entity.createdAt

  model.markets = entity.markets
    ? entity.markets
      .map(entity => modelFromPredictFunMarketEntity(entity))
      .filter(model => !!model)
    : []

  return model
}

@Entity('predict_fun_unloaded_events')
@Unique(["id"])
export class PredictFunUnloadedEventEntity implements IEvent {
  type: string = EventType.PredictFun

  @Index()
  @PrimaryColumn('int')
  id!: number

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

  @Column('varchar')
  conditionId!: string

  @Column('varchar')
  categorySlug!: string

  @Column('timestamptz')
  createdAt!: Date

  @OneToMany(() => PredictFunUnloadedMarketEntity, (market) => market.event)
  markets!: PredictFunUnloadedMarketEntity[];

  Downcast() {
    return this
  }

  GetMarkets(): IMarket[] {
    return this.markets
  }

  GetTitle(): string {
    return this.title
  }
  GetIdentificator(): string {
    return this.id.toString()
  }
  GetEventType(): EventType {
    return EventType.PredictFun
  }
}


export function modelFromPredictFunUnloadedEventEntity(
  entity: PredictFunUnloadedEventEntity | undefined,
): PredictFunEvent | undefined {
  if (!entity) {
    return undefined
  }
  const model = new PredictFunEvent()

  model.id = entity.id
  model.title = entity.title
  model.question = entity.question
  model.description = entity.description
  model.imageUrl = entity.imageUrl
  model.status = entity.status
  model.isNegRisk = entity.isNegRisk
  model.conditionId = entity.conditionId
  model.categorySlug = entity.categorySlug
  model.createdAt = entity.createdAt

  console.log("Entitty Markets: ", entity.markets)
  model.markets = entity.markets
    ? entity.markets
      .map(entity => modelFromPredictFunUnloadedMarketEntity(entity))
      .filter(model => !!model)
    : []

  console.log("Model Markets: ", model.markets)

  return model
}
