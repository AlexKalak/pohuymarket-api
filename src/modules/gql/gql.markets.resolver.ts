import {
  Args,
  createUnionType,
  Field,
  Int,
  ObjectType,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import { PolymarketMarket } from '../markets/polymarketMarket.model';
import { KalshiMarket } from '../markets/kalshiMarket.model';
import { MarketWhere } from '../markets/market.interface';
import { MarketService } from '../markets/market.service';
import { plainToInstance } from 'class-transformer';

const MarketsUnion = createUnionType({
  name: 'MarketUnion',
  types: () => [PolymarketMarket, KalshiMarket] as const,
});

@ObjectType()
class MarketByTextResponse {
  @Field(() => [PolymarketMarket])
  polymarket: PolymarketMarket[];
  @Field(() => [KalshiMarket])
  kalshi: KalshiMarket[];
}

@Resolver()
export class GQLMarketResolver {
  constructor(private readonly marketService: MarketService) {}

  @Query(() => MarketByTextResponse)
  async marketsByText(
    @Args('text', { type: () => String, nullable: true })
    text?: string,
    @Args('first', { type: () => Int, nullable: true })
    first: number = 1000,
    @Args('skip', { type: () => Int, nullable: true })
    skip: number = 0,
  ): Promise<MarketByTextResponse> {
    if (first > 1000) {
      throw new GraphQLError('Too many entities requested', {
        extensions: {
          code: 'TOO_MANY_ENTITIES',
          timestamp: new Date().toISOString(),
        },
      });
    }

    if (!text || text.length < 3) {
      return {
        polymarket: [],
        kalshi: [],
      };
    }

    const polymarketMarkets = await this.marketService.findByTitlePolymarket({
      first,
      skip,
      title: text,
    });

    const kalshiMarkets = await this.marketService.findByTitleKalshi({
      first,
      skip,
      title: text,
    });

    return {
      polymarket: polymarketMarkets,
      kalshi: kalshiMarkets,
    };
  }

  @Query(() => MarketsUnion)
  async marketByIdentificator(
    @Args('identificator', { type: () => String, nullable: true })
    identificator?: string,
  ): Promise<PolymarketMarket | KalshiMarket | null> {
    if (!identificator) {
      return null;
    }

    if (!isNaN(+identificator)) {
      const polymarketMarketResult =
        await this.marketService.findPolymarketMarketByID(+identificator);
      if (!polymarketMarketResult.ok) {
        return null;
      }
      return polymarketMarketResult.value;
    } else {
      const kalshiMarketResult =
        await this.marketService.findKalshiMarketByTicker(identificator);

      if (!kalshiMarketResult.ok) {
        return null;
      }

      return kalshiMarketResult.value;
    }
  }

  @Query(() => [MarketsUnion])
  async markets(
    @Args('where', { type: () => MarketWhere, nullable: true })
    wherePlain?: MarketWhere,
    @Args('first', { type: () => Int, nullable: true })
    first: number = 1000,
    @Args('skip', { type: () => Int, nullable: true })
    skip: number = 0,
  ): Promise<Array<typeof MarketsUnion>> {
    if (first > 1000) {
      throw new GraphQLError('Too many entities requested', {
        extensions: {
          code: 'TOO_MANY_ENTITIES',
          timestamp: new Date().toISOString(),
        },
      });
    }
    const where = plainToInstance(MarketWhere, wherePlain);

    const markets = await this.marketService.find({
      first,
      skip,
      where,
    });

    return markets;
  }
}
