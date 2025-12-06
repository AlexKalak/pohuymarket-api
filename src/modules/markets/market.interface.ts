import { IEvent } from '../events/event.interface';

export enum MarketType {
  Polymarket = 'polymarket',
  Kalshi = 'kalshi',
}

export interface IMarket {
  GetMarketType(): MarketType;

  GetIdentificator(): string;
  GetTitle(): string;
  GetQuestion(): string;
  GetStart(): Date;
  GetEnd(): Date;

  GetIsClosed(): boolean;

  GetEvent(): Promise<IEvent>;

  Downcast(): any;
}
