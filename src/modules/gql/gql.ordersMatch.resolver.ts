import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import { OrdersMatchService } from '../ordersMatchModule/ordersMatch.service';
import { OrdersMatch, OrdersMatchWhere } from 'src/models/ordersMatch.model';

@Resolver()
export class GQLOrdersMatchResolver {
  constructor(private readonly ordersMatchService: OrdersMatchService) {}

  @Query(() => [OrdersMatch])
  async ordersMatches(
    @Args('fromHead', { type: () => Boolean, nullable: true })
    fromHead: boolean = true,
    @Args('where', { type: () => OrdersMatchWhere, nullable: true })
    where?: OrdersMatchWhere,
    @Args('first', { type: () => Int, nullable: true })
    first: number = 1000,
    @Args('skip', { type: () => Int, nullable: true })
    skip: number = 0,
  ): Promise<OrdersMatch[]> {
    if (first > 1000) {
      throw new GraphQLError('Too many entities requested', {
        extensions: {
          code: 'TOO_MANY_ENTITIES',
          timestamp: new Date().toISOString(),
        },
      });
    }

    return this.ordersMatchService.find({
      first,
      skip,
      fromHead,
      where,
    });
  }
}
