import { Inject, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import {
  KalshiMarket,
  KalshiMarketEntity,
  KalshiMarketWhere,
  KalshiUnloadedMarketEntity,
  modelFromKalshiMarketEntity,
  modelFromUnloadedKalshiMarketEntity,
} from './kalshiMarket.model';
import {
  modelFromPolymarketMarketEntity,
  modelFromUnloadedPolymarketMarketEntity,
  PolymarketMarket,
  PolymarketMarketEntity,
  PolymarketMarketWhere,
  PolymarketUnloadedMarketEntity,
} from './polymarketMarket.model';
import { GqlWhereParsingService } from 'src/datasources/database/gqlWhereParsing.service';
import { MarketWhere } from './market.interface';
import { Err, Ok, Result } from 'src/helpers/helpertypes';

type MarketServiceFindProps = {
  first: number;
  skip: number;
  where?: MarketWhere;
};

@Injectable()
export class MarketService {
  constructor(
    @Inject('POLYMARKET_MARKET_REPOSITORY')
    private polymarketMarketRepository: Repository<PolymarketMarketEntity>,
    @Inject('POLYMARKET_UNLOADED_MARKET_REPOSITORY')
    private polymarketUnloadedMarketRepository: Repository<PolymarketUnloadedMarketEntity>,
    @Inject('KALSHI_MARKET_REPOSITORY')
    private kalshiMarketRepository: Repository<KalshiMarketEntity>,
    @Inject('KALSHI_UNLOADED_MARKET_REPOSITORY')
    private kalshiUnloadedMarketRepository: Repository<KalshiUnloadedMarketEntity>,
    @Inject('DATA_SOURCE')
    private dataSource: DataSource,

    private gqlWhereParsingService: GqlWhereParsingService,
  ) {}

  async findByTitlePolymarket({
    first,
    skip,
    title,
  }: {
    first: number;
    skip: number;
    title: string;
  }): Promise<PolymarketMarket[]> {
    const qb = this.polymarketUnloadedMarketRepository
      .createQueryBuilder('market')
      .leftJoinAndSelect('market.event', 'event')
      .addSelect(
        `
      CASE
          WHEN market.question= :search THEN 3
          WHEN market.question ILIKE :prefix THEN 2
          WHEN market.question % :search THEN 1
          ELSE 0
      END
  `,
        'match_rank',
      )
      .addSelect(`similarity(market.question, :search)`, 'similarity_score')
      .setParameters({
        search: title,
        prefix: `${title}%`,
      })
      .orderBy('match_rank', 'DESC')
      .addOrderBy('similarity_score', 'DESC')
      .take(first)
      .skip(skip);

    const results = await qb.getRawAndEntities();
    const polymarketMarkets = results.entities
      .map((entity) => modelFromUnloadedPolymarketMarketEntity(entity))
      .filter((market) => !!market);

    return polymarketMarkets;
  }

  async findByTitleKalshi({
    first,
    skip,
    title,
  }: {
    first: number;
    skip: number;
    title: string;
  }): Promise<KalshiMarket[]> {
    const qb = this.kalshiUnloadedMarketRepository
      .createQueryBuilder('market')
      .addSelect(
        `
      CASE
          WHEN CONCAT(market.title,market.custom) = :search THEN 3
          WHEN CONCAT(market.title,market.custom) ILIKE :prefix THEN 2
          WHEN CONCAT(market.title,market.custom) % :search THEN 1
          ELSE 0
      END
  `,
        'match_rank',
      )
      .addSelect(
        `similarity(CONCAT(market.title,market.custom), :search)`,
        'similarity_score',
      )
      .setParameters({
        search: title,
        prefix: `${title}%`,
      })
      .orderBy('match_rank', 'DESC')
      .addOrderBy('similarity_score', 'DESC')
      .take(first)
      .skip(skip);

    const results = await qb.getRawAndEntities();
    const kalshiMarkets = results.entities
      .map((entity) => modelFromUnloadedKalshiMarketEntity(entity))
      .filter((market) => !!market);

    return kalshiMarkets;
  }

  async find({
    first,
    skip,
    where,
  }: MarketServiceFindProps): Promise<(KalshiMarket | PolymarketMarket)[]> {
    if (!where) {
      const polymarketMarketsPromise = this.findPolymarketMarkets({
        first,
        skip,
      });

      const kalshiMarketsPromise = this.findKalshiMarkets({
        first,
        skip,
      });

      const [polymarketMarkets, kalshiMarkets] = await Promise.all([
        polymarketMarketsPromise,
        kalshiMarketsPromise,
      ]);

      console.log('pol:', polymarketMarkets);
      console.log('kal:', kalshiMarkets);

      return [...polymarketMarkets, ...kalshiMarkets];
    }

    const polymarketMarketWhere = new PolymarketMarketWhere(where);
    const kalshiMarketWhere = new KalshiMarketWhere(where);

    const polymarketMarketsPromise = this.findPolymarketMarkets({
      first,
      skip,
      where: polymarketMarketWhere,
    });

    const kalshiMarketsPromise = this.findKalshiMarkets({
      first,
      skip,
      where: kalshiMarketWhere,
    });

    const [polymarketMarkets, kalshiMarkets] = await Promise.all([
      polymarketMarketsPromise,
      kalshiMarketsPromise,
    ]);
    console.log('pol:', polymarketMarkets);
    console.log('kal:', kalshiMarkets);

    return [...polymarketMarkets, ...kalshiMarkets];
  }

  async findPolymarketMarkets({
    first,
    skip,
    where,
  }: {
    first?: number;
    skip?: number;
    where?: PolymarketMarketWhere;
  }): Promise<PolymarketMarket[]> {
    if (!where) {
      return this.polymarketMarketRepository
        .find({
          skip: skip,
          take: first,
        })
        .then((entities) =>
          entities
            ?.map((entity) => modelFromPolymarketMarketEntity(entity))
            .filter((market) => !!market),
        );
    }

    const queryBuilder =
      this.polymarketMarketRepository.createQueryBuilder('polymarket_markets');

    const metadata = this.polymarketMarketRepository.metadata;

    this.gqlWhereParsingService.parse(queryBuilder, where, metadata);

    const polymarketMarkets = queryBuilder.take(first).skip(skip).getMany();

    return polymarketMarkets.then((entities) =>
      entities
        ?.map((entity) => modelFromPolymarketMarketEntity(entity))
        .filter((market) => !!market),
    );
  }

  async findKalshiMarkets({
    first,
    skip,
    where,
  }: {
    first?: number;
    skip?: number;
    where?: KalshiMarketWhere;
  }): Promise<KalshiMarket[]> {
    if (!where) {
      return this.kalshiMarketRepository
        .find({
          skip: skip,
          take: first,
        })
        .then((entities) =>
          entities
            ?.map((entity) => modelFromKalshiMarketEntity(entity))
            .filter((market) => !!market),
        );
    }

    const queryBuilder =
      this.kalshiMarketRepository.createQueryBuilder('kalshi_markets');

    const metadata = this.kalshiMarketRepository.metadata;

    this.gqlWhereParsingService.parse(queryBuilder, where, metadata);

    const kalshiMarkets = queryBuilder.take(first).skip(skip).getMany();

    return kalshiMarkets.then((entities) =>
      entities
        ?.map((entity) => modelFromKalshiMarketEntity(entity))
        .filter((market) => !!market),
    );
  }

  async findPolymarketMarketByID(
    id: number,
  ): Promise<Result<PolymarketMarket, string>> {
    const response = await this.polymarketMarketRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!response) {
      return Err('Polymarket market not found');
    }

    try {
      const model = modelFromPolymarketMarketEntity(response);
      if (!model) {
        return Err('Unable to parse polymarket market');
      }
      return Ok(model);
    } catch (e) {
      return Err(`Unable to parse polymarket market - ${e}`);
    }
  }

  async findKalshiMarketByTicker(
    ticker: string,
  ): Promise<Result<KalshiMarket, string>> {
    const response = await this.kalshiMarketRepository.findOne({
      where: {
        ticker: ticker,
      },
    });

    if (!response) {
      return Err('Kalshi market not found');
    }

    try {
      const model = modelFromKalshiMarketEntity(response);
      if (!model) {
        return Err('Unable to parse kalshi market');
      }
      return Ok(model);
    } catch (e) {
      return Err(`Unable to parse kalshi market - ${e}`);
    }
  }
}
