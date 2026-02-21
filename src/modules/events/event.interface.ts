import { Field, InputType } from '@nestjs/graphql';
import { IMarket } from '../markets/market.interface';
import { StraightParsable } from 'src/models/decorators';

@InputType()
export class LoadEventInput {
  @Field()
  type: string;

  @Field({ nullable: true })
  slug?: string;

  @Field({ nullable: true })
  ticker?: string;
}

@InputType()
export class EventWhere {
  @Field({ nullable: true })
  @StraightParsable()
  identificator?: string;
}

export enum EventType {
  Polymarket = 'polymarket',
  Kalshi = 'kalshi',
  PredictFun = 'predictFun'
}

export interface IEvent {
  GetEventType(): EventType;

  GetIdentificator(): string;
  GetTitle(): string;

  GetMarkets(): IMarket[];

  Downcast(): any;
}
