import { Injectable, Inject } from '@nestjs/common';
import { GqlWhereParsingService } from 'src/datasources/database/gqlWhereParsing.service';
import { OrdersMatch, OrdersMatchWhere } from 'src/models/ordersMatch.model';
import { Brackets, Repository } from 'typeorm';

type OrdersMatchServiceFindProps = {
  first: number;
  skip: number;
  fromHead: boolean;
  where?: OrdersMatchWhere;
};

@Injectable()
export class OrdersMatchService {
  constructor(
    @Inject('ORDERS_MATCH_REPOSITORY')
    private ordersMatchRepository: Repository<OrdersMatch>,
    private gqlWhereParsingService: GqlWhereParsingService,
  ) {}

  async find({
    first,
    skip,
    fromHead,
    where,
  }: OrdersMatchServiceFindProps): Promise<OrdersMatch[]> {
    if (!where) {
      return this.ordersMatchRepository.find({
        skip: skip,
        take: first,
      });
    }

    const queryBuilder =
      this.ordersMatchRepository.createQueryBuilder('ordersMatch');

    console.log(where.takerOrMakerAssetId);

    if (where.takerOrMakerAssetId) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where(`${queryBuilder.alias}.takerAssetId = :assetId`).orWhere(
            `${queryBuilder.alias}.makerAssetId = :assetId`,
          );
        }),
        { assetId: where.takerOrMakerAssetId },
      );
    }

    const metadata = this.ordersMatchRepository.metadata;

    this.gqlWhereParsingService.parse(queryBuilder, where, metadata);

    const ordersMatches = queryBuilder
      .orderBy('ordersMatch.id', fromHead ? 'DESC' : 'ASC')
      .take(first)
      .skip(skip)
      .getMany();
    console.log(queryBuilder.getSql());
    console.log('Len: ', (await ordersMatches).length);

    return ordersMatches;
  }

  // async findByMinimalTimestamp({
  //   minimalTimestamp,
  //   skip,
  //   where,
  // }: V2SwapServiceFindByMinimalTimestampProps): Promise<V2Swap[]> {
  //   if (!where) {
  //     return this.ordersMatchRepository.find({
  //       skip: skip,
  //       where: {
  //         txTimestamp: MoreThan(minimalTimestamp),
  //       },
  //     });
  //   }
  //
  //   const queryBuilder = this.ordersMatchRepository
  //     .createQueryBuilder('swap')
  //     .leftJoinAndSelect('swap.pool', 'pool');
  //
  //   const metadata = this.ordersMatchRepository.metadata;
  //
  //   this.gqlWhereParsingService.parse(queryBuilder, where, metadata);
  //
  //   const swaps = queryBuilder
  //     .andWhere('swap.tx_timestamp > :minTimestamp', {
  //       minTimestamp: minimalTimestamp,
  //     })
  //     .orderBy('swap.id', 'DESC')
  //     .skip(skip)
  //     .getMany();
  //
  //   return swaps;
  // }
  //
  // async findByID(id: number): Promise<V2Swap | null> {
  //   return this.ordersMatchRepository.findOneBy({ id: id });
  // }
}
