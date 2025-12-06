import { Field, InputType } from '@nestjs/graphql';
import { IMarket } from '../markets/market.interface';
import { StraightParsable } from 'src/models/decorators';

@InputType()
export class EventWhere {
  @Field({ nullable: true })
  @StraightParsable()
  identificator?: string;
}

export enum EventType {
  Polymarket = 'polymarket',
  Kalshi = 'kalshi',
}

export interface IEvent {
  GetEventType(): EventType;

  GetIdentificator(): string;
  GetTitle(): string;

  GetMarkets(): Promise<IMarket[]>;

  Downcast(): any;
}
