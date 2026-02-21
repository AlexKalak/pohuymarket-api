import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import {
  modelFromPolymarketMarketEntity,
  PolymarketMarket,
  PolymarketMarketEntity,
} from '../markets/polymarketMarket.model';
import {
  KalshiMarket,
  KalshiMarketEntity,
  modelFromKalshiMarketEntity,
} from '../markets/kalshiMarket.model';
import { createUnionType, Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { DateScalar } from '../gql/gql.scalars';
import { StraightParsable } from 'src/models/decorators';
import { IMarket } from '../markets/market.interface';
import { PredictFunEvent } from '../events/predictFunEvent.model';
import { PredictFunMarket } from '../markets/predictFunMarket.model';

@InputType()
export class ArbitragePairWhere {
  @Field({ nullable: true })
  @StraightParsable()
  id?: number;

  @Field({ nullable: true })
  @StraightParsable()
  polymarketMarketID?: number;

  @Field({ nullable: true })
  @StraightParsable()
  kalshiMarketTicker?: string;
}

export const MarketsUnion = createUnionType({
  name: 'MarketUnion',
  types: () => [PolymarketMarket, KalshiMarket, PredictFunMarket] as const,
});

@ObjectType()
export class ArbitragePair {
  @Field(() => Int, { nullable: true })
  id: number;

  @Field(() => DateScalar, { nullable: true })
  createdAt: Date; // auto-set on INSERT

  @Field(() => DateScalar, { nullable: true })
  updatedAt: Date; // auto-set on UPDATE

  @Field(() => Boolean, { nullable: true })
  allowTrading!: boolean;

  @Field(() => String, { nullable: true })
  marketType1!: string

  @Field(() => String, { nullable: true })
  marketIdentificator1!: string

  @Field(() => String, { nullable: true })
  marketType2!: string

  @Field(() => String, { nullable: true })
  marketIdentificator2!: string

  @Field(() => MarketsUnion, { nullable: true })
  market1: KalshiMarket | PredictFunMarket | PolymarketMarket
  @Field(() => MarketsUnion, { nullable: true })
  market2: KalshiMarket | PredictFunMarket | PolymarketMarket
}

@Entity('arbitrage_pairs')
@Unique(['marketIdentificator1', 'marketIdentificator2'])
export class ArbitragePairEntity {
  @Index()
  @PrimaryGeneratedColumn()
  id!: number

  @CreateDateColumn()
  createdAt!: Date;   // auto-set on INSERT

  @UpdateDateColumn()
  updatedAt!: Date;   // auto-set on UPDATE

  @Column("varchar")
  marketType1!: string

  @Column("varchar")
  marketIdentificator1!: string

  @Column("varchar")
  marketType2!: string

  @Column("varchar")
  marketIdentificator2!: string

  @Column("boolean", { default: false })
  allowTrading!: boolean
}


export function modelFromArbitragePairEntity(
  entity: ArbitragePairEntity,
  market1?: PolymarketMarket | KalshiMarket | PredictFunMarket,
  market2?: PolymarketMarket | KalshiMarket | PredictFunMarket,
): ArbitragePair {
  const model = new ArbitragePair();
  model.id = entity.id;
  model.createdAt = entity.createdAt;
  model.updatedAt = entity.updatedAt;
  model.allowTrading = entity.allowTrading;

  model.marketIdentificator1 = entity.marketIdentificator1;
  model.marketIdentificator2 = entity.marketIdentificator2;
  model.marketType1 = entity.marketType1;
  model.marketType2 = entity.marketType2;

  if (market1) {
    model.market1 = market1
  }
  if (market2) {
    model.market2 = market2
  }

  return model;
}
