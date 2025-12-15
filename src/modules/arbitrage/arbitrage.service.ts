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

type FindArbitragePairsProps = {
  first: number;
  skip: number;
  where?: ArbitragePairWhere;
};

type CreatingPair = {
  polymarketMarketID: number;
  kalshiMarketTicker: string;
  revertPolymarket: boolean;
};

@Injectable()
export class ArbitrageService {
  constructor(
    @Inject('ARBITRAGE_PAIRS_REPOSITORY')
    private arbitragePairsRepository: Repository<ArbitragePairEntity>,
    private gqlWhereParsingService: GqlWhereParsingService,
    private marketService: MarketService,
  ) {}

  async find({
    first,
    skip,
    where,
  }: FindArbitragePairsProps): Promise<ArbitragePair[]> {
    if (!where) {
      return this.arbitragePairsRepository
        .find({
          order: {
            id: 'DESC',
          },
          skip: skip,
          take: first,
          relations: ['polymarketMarket', 'kalshiMarket'],
        })
        .then((entities) =>
          entities.map((entity) => modelFromArbitragePairEntity(entity)),
        );
    }

    const queryBuilder = this.arbitragePairsRepository
      .createQueryBuilder('arbitragePairs')
      .leftJoinAndSelect('arbitragePairs.polymarketMarket', 'polymarketMarket')
      .leftJoinAndSelect('arbitragePairs.kalshiMarket', 'kalshiMarket');

    const metadata = this.arbitragePairsRepository.metadata;
    this.gqlWhereParsingService.parse(queryBuilder, where, metadata);

    const arbitragePairsEntities = await queryBuilder
      .orderBy('arbitragePairs.id', 'DESC')
      .take(first)
      .skip(skip)
      .getMany();

    return arbitragePairsEntities.map((entity) =>
      modelFromArbitragePairEntity(entity),
    );
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

    const validPairs = await this.getValidPairsForCreation(pairs);

    let filledPairEntities: ArbitragePairEntity[] = [];
    try {
      const createdPairsEntities =
        await this.arbitragePairsRepository.save(validPairs);

      const ids = createdPairsEntities.map((m) => m.id);

      filledPairEntities = await this.arbitragePairsRepository.find({
        where: {
          id: In(ids),
        },
        relations: ['kalshiMarket', 'polymarketMarket'],
      });
    } catch (e) {
      console.log('Unable to save pairs: ', e);
      return Err(`Unable to save pairs: ${e}`);
    }

    const createdPairsModels: ArbitragePair[] = [];
    for (const arbitragePairEntity of filledPairEntities) {
      try {
        console.log('enti: ', arbitragePairEntity);
        const model = modelFromArbitragePairEntity(arbitragePairEntity);
        console.log('MOdel: ', model);
        createdPairsModels.push(model);
      } catch (e) {
        console.log(e);
        continue;
      }
    }
    console.log('');

    return Ok(createdPairsModels);
  }

  private async getValidPairsForCreation(
    pairs: CreatingPair[],
  ): Promise<CreatingPair[]> {
    const validPairs: CreatingPair[] = [];

    for (const checkingPair of pairs) {
      const polymarketPromise = this.marketService.findPolymarketMarketByID(
        checkingPair.polymarketMarketID,
      );
      const kalshiPromise = this.marketService.findKalshiMarketByTicker(
        checkingPair.kalshiMarketTicker,
      );

      try {
        await Promise.all([polymarketPromise, kalshiPromise]);

        validPairs.push(checkingPair);
      } catch {
        continue;
      }
    }

    return validPairs;
  }
}
