import {
  Args,
  Field,
  InputType,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import { ArbitrageService } from '../arbitrage/arbitrage.service';
import {
  ArbitragePair,
  ArbitragePairWhere,
} from '../arbitrage/arbitragePairs.model';
import { plainToInstance } from 'class-transformer';

@InputType()
class CreateArbitragePairInput {
  @Field({ nullable: false })
  polymarketMarketID: number;
  @Field({ nullable: false })
  kalshiMarketTicker: string;
  @Field({ nullable: false })
  revertPolymarket: boolean;
}

@ObjectType()
class DeleteArbitragesReponse {
  @Field(() => Boolean)
  ok: boolean;
}
@ObjectType()
class SetAllowTradingForArbPairResponse {
  @Field(() => Boolean)
  ok: boolean;
}

@Resolver()
export class GQLArbitrageResolver {
  constructor(private readonly arbitrageService: ArbitrageService) {}

  @Mutation(() => DeleteArbitragesReponse)
  async deleteArbitragePairs(
    @Args('ids', { type: () => [Int], nullable: true })
    ids: number[] = [],
  ): Promise<DeleteArbitragesReponse> {
    const ok = await this.arbitrageService.deleteArbitrages({ ids });

    if (!ok) {
      throw new GraphQLError('Not found arbitrage pair ids');
    }

    return {
      ok: true,
    };
  }

  @Mutation(() => SetAllowTradingForArbPairResponse)
  async setAllowTrading(
    @Args('id', { type: () => Int, nullable: false })
    id: number,
    @Args('allow', { type: () => Boolean, nullable: false })
    allow: boolean,
  ): Promise<DeleteArbitragesReponse> {
    const ok = await this.arbitrageService.setAllowTradingForPair({
      id,
      allow,
    });

    if (!ok) {
      throw new GraphQLError('Unable to update allow trading');
    }

    return {
      ok: true,
    };
  }

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
    wherePlain?: ArbitragePairWhere,
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

    const where = plainToInstance(ArbitragePairWhere, wherePlain);

    const pairs = await this.arbitrageService.find({
      first,
      skip,
      where,
    });

    return pairs;
  }
}
