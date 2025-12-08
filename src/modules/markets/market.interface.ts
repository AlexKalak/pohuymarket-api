import { Field, InputType } from '@nestjs/graphql';
import { IEvent } from '../events/event.interface';
import { StraightParsable } from 'src/models/decorators';

export enum MarketType {
  Polymarket = 'polymarket',
  Kalshi = 'kalshi',
}

export function marketTypeFromString(marketType: string): MarketType {
  switch (marketType) {
    case MarketType.Polymarket.toString():
      return MarketType.Polymarket;
    case MarketType.Kalshi.toString():
      return MarketType.Kalshi;
  }

  throw new Error('Unable to convert string to MarketType');
}

@InputType()
export class MarketWhere {
  @Field({ nullable: true })
  @StraightParsable()
  identificator?: string;
}

export interface IMarket {
  GetMarketType(): MarketType;

  GetIdentificator(): string;
  GetTitle(): string;
  GetQuestion(): string;
  GetStart(): Date;
  GetEnd(): Date;

  GetIsClosed(): boolean;

  GetEvent(): IEvent;

  Downcast(): any;
}
