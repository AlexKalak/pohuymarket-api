import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
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
import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { DateScalar } from '../gql/gql.scalars';
import { StraightParsable } from 'src/models/decorators';

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
  kalshiMarketTikcer?: string;
}

@ObjectType()
export class ArbitragePair {
  @Field(() => Int, { nullable: true })
  id: number;

  @Field(() => Int, { nullable: true })
  polymarketMarketID!: number;

  @Field(() => DateScalar, { nullable: true })
  createdAt: Date; // auto-set on INSERT

  @Field(() => DateScalar, { nullable: true })
  updatedAt: Date; // auto-set on UPDATE

  @Field(() => PolymarketMarket, { nullable: true })
  polymarketMarket: PolymarketMarket;

  @Field(() => String, { nullable: true })
  kalshiMarketTicker: string;

  @Field(() => KalshiMarket, { nullable: true })
  kalshiMarket: KalshiMarket;
}

@Entity('arbitrage_pairs')
@Unique(['polymarketMarketID', 'kalshiMarketTicker'])
export class ArbitragePairEntity {
  @Index()
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn()
  createdAt!: Date; // auto-set on INSERT

  @UpdateDateColumn()
  updatedAt!: Date; // auto-set on UPDATE

  @Column('int')
  polymarketMarketID!: number;

  @ManyToOne(() => PolymarketMarketEntity)
  @JoinColumn({ name: 'polymarketMarketID', referencedColumnName: 'id' })
  polymarketMarket!: PolymarketMarketEntity;

  @Column('varchar')
  kalshiMarketTicker!: string;

  @ManyToOne(() => KalshiMarketEntity)
  @JoinColumn({ name: 'kalshiMarketTicker', referencedColumnName: 'ticker' })
  kalshiMarket!: KalshiMarketEntity;
}

export function modelFromArbitragePairEntity(
  entity: ArbitragePairEntity,
): ArbitragePair {
  const model = new ArbitragePair();
  model.id = entity.id;
  model.polymarketMarketID = entity.polymarketMarketID;
  model.kalshiMarketTicker = entity.kalshiMarketTicker;
  model.createdAt = entity.createdAt;
  model.updatedAt = entity.updatedAt;

  const polymarketMarket = modelFromPolymarketMarketEntity(
    entity.polymarketMarket,
  );
  if (!polymarketMarket) {
    throw new Error(
      'Unable to construct arbitrage pair - polymarketMarket not found',
    );
  }

  const kalshiMarket = modelFromKalshiMarketEntity(entity.kalshiMarket);
  if (!kalshiMarket) {
    throw new Error(
      'Unable to construct arbitrage pair - kalshiMarket not found',
    );
  }

  model.polymarketMarket = polymarketMarket;
  model.kalshiMarket = kalshiMarket;

  return model;
}
