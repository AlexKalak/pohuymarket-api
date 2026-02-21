import { Args, createUnionType, Int, Query, Resolver } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import { OrdersMatchService } from '../ordersMatchModule/ordersMatch.service';
import { OrdersMatch, OrdersMatchWhere } from 'src/models/ordersMatch.model';
import { plainToInstance } from 'class-transformer';
import { ArbitragePairWhere } from '../arbitrage/arbitragePairs.model';
import { OrdersService } from '../orders/orders.service';
import { KalshiOrderFill, KalshiOrderFillEntity, PolymarketOrderFill, PolymarketOrderFillEntity } from '../orders/orders.model';

const OrderFillsUnion = createUnionType({
  name: 'OrderFillsUnion',
  types: () => [PolymarketOrderFill, KalshiOrderFill] as const,
});

@Resolver()
export class GQLOrdersResolver {
  constructor(private readonly ordersService: OrdersService) { }

  @Query(() => [OrderFillsUnion])
  async orderFills(
    @Args('marketIdentificator', { type: () => String, nullable: true })
    marketIdentificator: string
  ): Promise<(PolymarketOrderFill | KalshiOrderFill)[] | null> {

    let resp: (KalshiOrderFill | PolymarketOrderFill)[] = []
    if (marketIdentificator.startsWith("K")) {
      resp = await this.ordersService.getKalshiOrderFillsForMarket(marketIdentificator);
    }
    if (marketIdentificator.startsWith("0")) {
      console.log("getting polymarket order fills for: ", marketIdentificator)
      resp = await this.ordersService.getPolymarketOrderFillsForMarket(marketIdentificator);
    }

    console.log("resp: ", resp)
    return resp
  }
}
