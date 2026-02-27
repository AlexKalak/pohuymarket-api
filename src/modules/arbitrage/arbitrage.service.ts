import { Inject, Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import {
  ArbitragePair,
  ArbitragePairEntity,
  ArbitragePairWhere,
  modelFromArbitragePairEntity,
} from './arbitragePairs.model';
import { Err, Ok, Result } from 'src/helpers/helpertypes';
import { MarketService } from '../markets/market.service';
import { GqlWhereParsingService } from 'src/datasources/database/gqlWhereParsing.service';
import { MarketType } from '../markets/market.interface';
import { KalshiMarket, KalshiMarketEntity } from '../markets/kalshiMarket.model';
import { PolymarketMarket, PolymarketMarketEntity } from '../markets/polymarketMarket.model';
import { PredictFunMarket, PredictFunMarketEntity } from '../markets/predictFunMarket.model';

type FindArbitragePairsProps = {
  first: number;
  skip: number;
  where?: ArbitragePairWhere;
};

type CreatingPair = {
  marketIdentificator1: string
  marketIdentificator2: string
  marketType1: string
  marketType2: string
};

@Injectable()
export class ArbitrageService {
  constructor(
    @Inject('ARBITRAGE_PAIRS_REPOSITORY')
    private arbitragePairsRepository: Repository<ArbitragePairEntity>,
    private gqlWhereParsingService: GqlWhereParsingService,
    private marketService: MarketService,
  ) { }

  async find({
    first,
    skip,
    where,
  }: FindArbitragePairsProps): Promise<ArbitragePair[]> {
    let arbitragePairs: ArbitragePairEntity[] = []
    if (!where) {
      arbitragePairs = await this.arbitragePairsRepository
        .find({
          order: {
            id: 'DESC',
          },
          skip: skip,
          take: first,
        })
    } else {
      const queryBuilder = this.arbitragePairsRepository
        .createQueryBuilder('arbitragePairs')

      const metadata = this.arbitragePairsRepository.metadata;
      this.gqlWhereParsingService.parse(queryBuilder, where, metadata);

      arbitragePairs = await queryBuilder
        .orderBy('arbitragePairs.id', 'DESC')
        .take(first)
        .skip(skip)
        .getMany();
    }

    const promises: Promise<ArbitragePair | undefined>[] = []
    arbitragePairs.forEach(arbPair => {
      promises.push(this.loadMarketsForArbPairEntity(arbPair))
    })

    const arbPairsDirty = await Promise.all(promises)
    return arbPairsDirty.filter(arbPair => !!arbPair)
  }

  private async loadMarketsForArbPairEntity(arbPair: ArbitragePairEntity): Promise<ArbitragePair | undefined> {
    let firstPromise: Promise<Result<PolymarketMarket | KalshiMarket | PredictFunMarket, string>> | undefined
    let secondPromise: Promise<Result<PolymarketMarket | KalshiMarket | PredictFunMarket, string>> | undefined


    switch (arbPair.marketType1) {
      case MarketType.Polymarket:
        firstPromise = this.marketService.findPolymarketMarketByConditionID(
          arbPair.marketIdentificator1,
        );
        break;
      case MarketType.Kalshi:
        firstPromise = this.marketService.findKalshiMarketByTicker(
          arbPair.marketIdentificator1,
        );
        break;
      case MarketType.PredictFun:
        firstPromise = this.marketService.findPredictFunMarketByID(
          arbPair.marketIdentificator1,
        );
        break;
    }

    switch (arbPair.marketType2) {
      case MarketType.Polymarket:
        secondPromise = this.marketService.findPolymarketMarketByConditionID(
          arbPair.marketIdentificator2,
        );
        break;
      case MarketType.Kalshi:
        secondPromise = this.marketService.findKalshiMarketByTicker(
          arbPair.marketIdentificator2,
        );
        break;
      case MarketType.PredictFun:
        secondPromise = this.marketService.findPredictFunMarketByID(
          arbPair.marketIdentificator2,
        );
        break;
    }

    const marketResults = await Promise.all([firstPromise, secondPromise])

    let marketResult1 = marketResults[0]
    let marketResult2 = marketResults[1]
    console.log("marketresult2 : ", marketResult2)

    let market1: PolymarketMarket | KalshiMarket | PredictFunMarket | undefined = undefined
    let market2: PolymarketMarket | KalshiMarket | PredictFunMarket | undefined = undefined


    if (marketResult1?.ok) {
      market1 = marketResult1.value
    }
    if (marketResult2?.ok) {
      market2 = marketResult2.value
    }

    try {
      const model = modelFromArbitragePairEntity(arbPair, market1, market2);
      return model
    } catch (e) {
      return
    }

  }

  public async deleteArbitrages({ ids }: { ids: number[] }): Promise<boolean> {
    const result = await this.arbitragePairsRepository.delete(ids);
    if (result.affected) {
      return true;
    }
    return false;
  }

  public async setAllowTradingForPair({
    id,
    allow,
  }: {
    id: number;
    allow: boolean;
  }): Promise<boolean> {
    const result = await this.arbitragePairsRepository.update(
      {
        id: id,
      },
      {
        allowTrading: allow,
      },
    );

    if (result.affected) {
      return true;
    }
    return false;
  }

  public async createArbitragePairs(
    pairs: CreatingPair[],
  ): Promise<Result<ArbitragePair[], string>> {
    if (pairs.length === 0) {
      return Ok([]);
    }

    const { validPairs, markets } = await this.getValidPairsForCreation(pairs);
    console.log("validPairs: ", validPairs)

    let createdPairs: ArbitragePairEntity[] = [];
    try {
      createdPairs =
        await this.arbitragePairsRepository.save(validPairs);
    } catch (e) {
      console.log('Unable to save pairs: ', e);
      return Err(`Unable to save pairs: ${e}`);
    }

    const createdPairsModels: ArbitragePair[] = [];
    for (const arbitragePairEntity of createdPairs) {
      let market1 = markets.get(arbitragePairEntity.marketIdentificator1)
      let market2 = markets.get(arbitragePairEntity.marketIdentificator2)

      try {
        const model = modelFromArbitragePairEntity(arbitragePairEntity, market1, market2);
        createdPairsModels.push(model);
      } catch (e) {
        continue;
      }
    }

    return Ok(createdPairsModels);
  }

  private async getValidPairsForCreation(
    pairs: CreatingPair[],
  ): Promise<{
    validPairs: CreatingPair[],
    markets: Map<string, PolymarketMarket | KalshiMarket | PredictFunMarket>
  }> {
    const validPairs: CreatingPair[] = [];

    const markets: Map<string, PolymarketMarket | KalshiMarket | PredictFunMarket> = new Map()

    let firstPromise: Promise<Result<PolymarketMarket | KalshiMarket | PredictFunMarket, string>> | undefined
    let secondPromise: Promise<Result<PolymarketMarket | KalshiMarket | PredictFunMarket, string>> | undefined

    for (const checkingPair of pairs) {
      switch (checkingPair.marketType1) {
        case MarketType.Polymarket:
          firstPromise = this.marketService.findPolymarketMarketByConditionID(
            checkingPair.marketIdentificator1,
          );
          break;
        case MarketType.Kalshi:
          firstPromise = this.marketService.findKalshiMarketByTicker(
            checkingPair.marketIdentificator1,
          );
          break;
        case MarketType.PredictFun:
          firstPromise = this.marketService.findPredictFunMarketByID(
            checkingPair.marketIdentificator1,
          );
          break;
      }

      switch (checkingPair.marketType2) {
        case MarketType.Polymarket:
          secondPromise = this.marketService.findPolymarketMarketByConditionID(
            checkingPair.marketIdentificator2,
          );
          break;
        case MarketType.Kalshi:
          secondPromise = this.marketService.findKalshiMarketByTicker(
            checkingPair.marketIdentificator2,
          );
          break;
        case MarketType.PredictFun:
          secondPromise = this.marketService.findPredictFunMarketByID(
            checkingPair.marketIdentificator2,
          );
          break;
      }

      try {
        const marketResults = await Promise.all([firstPromise, secondPromise]);
        const market1Result = marketResults[0]
        const market2Result = marketResults[1]

        if (market1Result?.ok) {
          console.log("Not found market1: ", market1Result.value)
          markets.set(checkingPair.marketIdentificator1, market1Result.value)
        }
        if (market2Result?.ok) {
          console.log("Not found market2: ", market2Result.value)
          markets.set(checkingPair.marketIdentificator2, market2Result.value)
        }
        validPairs.push(checkingPair);
      } catch (e) {
        console.log("Got error: ", e)
        continue;
      }
    }

    return { validPairs, markets };
  }
}
