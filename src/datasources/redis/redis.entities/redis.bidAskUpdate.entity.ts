import { BidAskUpdate, Order } from 'src/models/bidAskUpdate.model';
import { marketTypeFromString } from 'src/models/market.model';

type BidAsk = {
  bid: Order | null;
  ask: Order | null;
  timestamp: number;
};

export class RedisBestBidAskUpdateStreamEntity {
  market_type: string;
  market_identificator: string;
  bid_ask: BidAsk;

  constructor(message: string[]) {
    if (message.length < 6) {
      throw new Error(
        'Invalid messages in BestBidUpdateStreamEntity constructor',
      );
    }

    console.log('message: ', message);
    this.market_type = message[1];
    this.market_identificator = message[3];
    this.bid_ask = JSON.parse(message[5]) as BidAsk;
  }

  public ToModel(): BidAskUpdate {
    const model = new BidAskUpdate();
    model.marketType = marketTypeFromString(this.market_type);
    model.marketIdentificator = this.market_identificator;
    model.bestBidUpdate = this.bid_ask.bid;
    model.bestAskUpdate = this.bid_ask.ask;
    model.timestamp = this.bid_ask.timestamp;

    return model;
  }
}

