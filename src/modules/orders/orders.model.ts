import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import { PolymarketMarket, PolymarketMarketEntity } from "../markets/polymarketMarket.model";
import { KalshiMarket, KalshiMarketEntity } from "../markets/kalshiMarket.model";
import { Field, Float, Int, ObjectType } from "@nestjs/graphql";
import { BigIntScalar, DateScalar } from "../gql/gql.scalars";

@ObjectType()
export class PolymarketOrder {
  @Field(() => Int, { nullable: true })
  id!: string

  @Field(() => DateScalar, { nullable: true })
  createdAt!: Date;   // auto-set on INSERT

  @Field(() => DateScalar, { nullable: true })
  updatedAt!: Date;   // auto-set on UPDATE

  @Field(() => String, { nullable: true })
  polymarketAssetID!: string

  @Field(() => String, { nullable: true })
  side!: string

  @Field(() => String, { nullable: true })
  action!: string

  @Field(() => String, { nullable: true })
  polymarketMarketIdentificator!: string

  @Field(() => Float, { nullable: true })
  price!: number | null

  @Field(() => Float, { nullable: true })
  amount!: number | null

  @Field(() => String, { nullable: true })
  type!: "limit" | "market"

  @Field(() => PolymarketMarket, { nullable: true })
  polymarketMarket!: PolymarketMarket;
}


@Entity('polymarketOrder')
@Unique(['id'])
export class PolymarketOrderEntity {
  @Index()
  @PrimaryColumn("varchar")
  id!: string

  @CreateDateColumn()
  createdAt!: Date;   // auto-set on INSERT

  @UpdateDateColumn()
  updatedAt!: Date;   // auto-set on UPDATE

  @Column("varchar")
  polymarketAssetID!: string

  @Column("varchar", { nullable: false })
  side!: string

  @Column("varchar", { nullable: false })
  action!: string

  @Column("varchar")
  polymarketMarketIdentificator!: string

  @Column("numeric", { nullable: true })
  price!: number | null

  @Column("numeric", { nullable: true })
  amount!: number | null

  @Column("varchar")
  type!: "limit" | "market"


  @ManyToOne(() => PolymarketMarketEntity)
  @JoinColumn({ name: 'polymarketMarketIdentificator', referencedColumnName: 'conditionId' })
  polymarketMarket!: PolymarketMarketEntity;
}

@ObjectType()
export class KalshiOrder {
  @Field(() => Int, { nullable: true })
  id!: string

  @Field(() => DateScalar, { nullable: true })
  createdAt!: Date;   // auto-set on INSERT

  @Field(() => DateScalar, { nullable: true })
  updatedAt!: Date;   // auto-set on UPDATE

  @Field(() => String, { nullable: true })
  side!: string

  @Field(() => String, { nullable: true })
  action!: string

  @Field(() => Float, { nullable: true })
  price!: number | null

  @Field(() => Float, { nullable: true })
  amount!: number | null

  @Field(() => String, { nullable: true })
  type!: "limit" | "market"

  @Field(() => String, { nullable: true })
  kalshiMarketTicker!: string

  @Field(() => KalshiMarket, { nullable: true })
  kalshiMarket!: KalshiMarket;
}

@Entity('kalshiOrder')
@Unique(['id'])
export class KalshiOrderEntity {
  @Index()
  @PrimaryColumn("varchar")
  id!: string

  @CreateDateColumn()
  createdAt!: Date;   // auto-set on INSERT

  @UpdateDateColumn()
  updatedAt!: Date;   // auto-set on UPDATE

  @Column("varchar", { nullable: false })
  side!: string

  @Column("varchar", { nullable: false })
  action!: string

  @Column("numeric", { nullable: true })
  price!: number | null

  @Column("numeric", { nullable: true })
  amount!: number | null

  @Column("varchar", { nullable: false })
  type!: "limit" | "market"

  @Column("varchar")
  kalshiMarketTicker!: string

  @ManyToOne(() => KalshiMarketEntity)
  @JoinColumn({ name: 'kalshiMarketTicker', referencedColumnName: 'ticker' })
  kalshiMarket!: KalshiMarketEntity;
}

@ObjectType()
export class PolymarketOrderFill {
  @Field(() => Int, { nullable: true })
  id!: number

  @Field(() => DateScalar, { nullable: true })
  createdAt!: Date;   // auto-set on INSERT

  @Field(() => DateScalar, { nullable: true })
  updatedAt!: Date;   // auto-set on UPDATE

  @Field(() => BigIntScalar, { nullable: true })
  timestamp!: number

  @Field(() => Float, { nullable: true })
  contractsAmount!: number

  @Field(() => Float, { nullable: true })
  price!: number

  @Field(() => String, { nullable: true })
  asset_id!: string

  @Field(() => String, { nullable: true })
  action!: string

  @Field(() => String, { nullable: true })
  polymarketOrderID!: string

  @Field(() => String, { nullable: true })
  polymarketMarketIdentificator!: string
}

@Entity('polymarketOrderFills')
@Unique(['id'])
export class PolymarketOrderFillEntity {
  @Index()
  @PrimaryGeneratedColumn()
  id!: number

  @CreateDateColumn()
  createdAt!: Date;   // auto-set on INSERT

  @UpdateDateColumn()
  updatedAt!: Date;   // auto-set on UPDATE

  @Column("numeric", { nullable: false })
  timestamp!: number

  @Column("numeric")
  contractsAmount!: number

  @Column("numeric")
  price!: number

  @Column("varchar")
  asset_id!: string

  @Column("varchar", { nullable: false })
  action!: string

  @Column("varchar")
  polymarketOrderID!: string

  @Column("varchar")
  polymarketMarketIdentificator!: string
}

export function polymarketOrderFillEntityToModel(entity: PolymarketOrderFillEntity): PolymarketOrderFill {
  const model = new PolymarketOrderFill()
  model.id = entity.id
  model.createdAt = entity.createdAt
  model.updatedAt = entity.updatedAt
  model.timestamp = entity.timestamp
  model.contractsAmount = entity.contractsAmount
  model.price = entity.price
  model.action = entity.action
  model.asset_id = entity.asset_id
  model.polymarketOrderID = entity.polymarketOrderID
  model.polymarketMarketIdentificator = entity.polymarketMarketIdentificator
  return model
}

@ObjectType()
export class KalshiOrderFill {
  @Field(() => Int, { nullable: true })
  id!: number

  @Field(() => DateScalar, { nullable: true })
  createdAt!: Date;   // auto-set on INSERT
  @Field(() => DateScalar, { nullable: true })
  updatedAt!: Date;   // auto-set on UPDATE

  @Field(() => BigIntScalar, { nullable: true })
  timestamp!: number

  @Field(() => Float, { nullable: true })
  contractsAmount!: number

  @Field(() => Float, { nullable: true })
  price!: number

  @Field(() => String, { nullable: true })
  side!: string

  @Field(() => String, { nullable: true })
  action!: string

  @Field(() => String, { nullable: true })
  kalshiOrderID!: string

  @Field(() => String, { nullable: true })
  kalshiMarketTicker!: string
}

@Entity('kalshiOrderFills')
@Unique(['id'])
export class KalshiOrderFillEntity {
  @Index()
  @PrimaryGeneratedColumn()
  id!: number

  @CreateDateColumn()
  createdAt!: Date;   // auto-set on INSERT

  @UpdateDateColumn()
  updatedAt!: Date;   // auto-set on UPDATE

  @Column("numeric", { nullable: false })
  timestamp!: number

  @Column("numeric")
  contractsAmount!: number

  @Column("numeric")
  price!: number

  @Column("varchar")
  side!: string

  @Column("varchar", { nullable: false })
  action!: string

  @Column("varchar")
  kalshiOrderID!: string

  @Column("varchar")
  kalshiMarketTicker!: string
}

export function kalshiOrderFillEntityToModel(entity: KalshiOrderFillEntity): KalshiOrderFill {
  const model = new KalshiOrderFill()
  model.id = entity.id
  model.createdAt = entity.createdAt
  model.updatedAt = entity.updatedAt
  model.timestamp = entity.timestamp
  model.contractsAmount = entity.contractsAmount
  model.price = entity.price
  model.side = entity.side
  model.action = entity.action
  model.kalshiOrderID = entity.kalshiOrderID
  model.kalshiMarketTicker = entity.kalshiMarketTicker
  return model
}
