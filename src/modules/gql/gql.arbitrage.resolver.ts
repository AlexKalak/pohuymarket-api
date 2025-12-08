import {
  Args,
  Field,
  InputType,
  Int,
  Mutation,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import { ArbitrageService } from '../arbitrage/arbitrage.service';
import {
  ArbitragePair,
  ArbitragePairWhere,
} from '../arbitrage/arbitragePairs.model';

@InputType()
class CreateArbitragePairInput {
  @Field({ nullable: false })
  polymarketMarketID: number;
  @Field({ nullable: false })
  kalshiMarketTicker: string;
}

@Resolver()
export class GQLArbitrageResolver {
  constructor(private readonly arbitrageService: ArbitrageService) {}

  @Mutation(() => [ArbitragePair])
  async createArbitragePairs(
    @Args('pairs', { type: () => [CreateArbitragePairInput], nullable: true })
    pairs: CreateArbitragePairInput[] = [],
  ): Promise<ArbitragePair[]> {
    const arbitragePairsResult =
      await this.arbitrageService.createArbitragePairs(pairs);
    if (!arbitragePairsResult.ok) {
      throw new GraphQLError(arbitragePairsResult.error);
    }

    return arbitragePairsResult.value;
  }

  @Query(() => [ArbitragePair])
  async arbitragePairs(
    @Args('where', { type: () => ArbitragePairWhere, nullable: true })
    where?: ArbitragePairWhere,
    @Args('first', { type: () => Int, nullable: true })
    first: number = 1000,
    @Args('skip', { type: () => Int, nullable: true })
    skip: number = 0,
  ): Promise<ArbitragePair[]> {
    if (first > 1000) {
      throw new GraphQLError('Too many entities requested', {
        extensions: {
          code: 'TOO_MANY_ENTITIES',
          timestamp: new Date().toISOString(),
        },
      });
    }

    const markets = await this.arbitrageService.find({
      first,
      skip,
      where,
    });

    return markets;
  }
}
