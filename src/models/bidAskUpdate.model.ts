import { Field, Float, InputType, Int, ObjectType } from '@nestjs/graphql';
import { StraightParsable } from './decorators';
import {
  MarketType,
  marketTypeFromString,
} from 'src/modules/markets/market.interface';
import { Column, Entity, Index, PrimaryGeneratedColumn, Unique } from 'typeorm';

@ObjectType()
export class Order {
  @Field(() => Float, { nullable: true })
  price: number;
  @Field(() => Int, { nullable: true })
  size: number;
}

@ObjectType()
export class BidAskUpdate {
  @Field(() => String, { nullable: true })
  marketType: MarketType;

  @Field(() => String, { nullable: true })
  marketIdentificator: string;

  @Field(() => Order, { nullable: true })
  bestBidUpdate: Order | null;

  @Field(() => Order, { nullable: true })
  bestAskUpdate: Order | null;

  @Field(() => String, { nullable: true })
  timestamp: string;
}

@InputType()
export class BidAskUpdateWhere {
  @Field({ nullable: true })
  @StraightParsable()
  timestamp_gt?: string;

  @Field({ nullable: true })
  @StraightParsable()
  marketIdentificator?: string;
}

@Entity('bid_ask_updates')
@Unique(['id'])
export class BidAskUpdateEntity {
  @Index()
  @PrimaryGeneratedColumn()
  id!: number;

  @Index()
  @Column('varchar')
  marketType!: string;

  @Index()
  @Column('varchar')
  marketIdentificator!: string;

  @Column('int', { nullable: true })
  bestBidUpdatePrice!: number | null;

  @Column('int', { nullable: true })
  bestBidUpdateSize!: number | null;

  @Column('int', { nullable: true })
  bestAskUpdatePrice!: number | null;

  @Column('int', { nullable: true })
  bestAskUpdateSize!: number | null;

  @Index()
  @Column('numeric')
  timestamp: number;
}

export function modelFromBidAskUpdateEntity(
  entity: BidAskUpdateEntity,
): BidAskUpdate {
  const model = new BidAskUpdate();

  model.timestamp = entity.timestamp.toString();
  model.marketType = marketTypeFromString(entity.marketType);
  model.marketIdentificator = entity.marketIdentificator;

  model.bestBidUpdate =
    entity.bestBidUpdatePrice && entity.bestBidUpdateSize
      ? {
          price: entity.bestBidUpdatePrice,
          size: entity.bestBidUpdateSize,
        }
      : null;

  model.bestAskUpdate =
    entity.bestAskUpdatePrice && entity.bestAskUpdateSize
      ? {
          price: entity.bestAskUpdatePrice,
          size: entity.bestAskUpdateSize,
        }
      : null;

  return model;
}
