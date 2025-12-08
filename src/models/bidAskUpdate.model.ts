import { Field, Float, InputType, Int, ObjectType } from '@nestjs/graphql';
import { StraightParsable } from './decorators';
import { MarketType } from 'src/modules/markets/market.interface';

@ObjectType()
export class Order {
  @Field(() => Float, { nullable: true })
  price: number;
  @Field(() => Int, { nullable: true })
  size: number;
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
