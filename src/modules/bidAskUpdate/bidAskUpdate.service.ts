import { Inject, Injectable } from '@nestjs/common';
import { GqlWhereParsingService } from 'src/datasources/database/gqlWhereParsing.service';
import {
  BidAskUpdate,
  BidAskUpdateEntity,
  BidAskUpdateWhere,
  modelFromBidAskUpdateEntity,
} from 'src/models/bidAskUpdate.model';
import { Repository } from 'typeorm';

type BidAskUpdateFindProps = {
  first: number;
  skip: number;
  fromHead: boolean;
  where?: BidAskUpdateWhere;
};
@Injectable()
export class BidAskUpdateService {
  constructor(
    @Inject('BID_ASK_UPDATE_REPOSITORY')
    private bidAskUpdateRepository: Repository<BidAskUpdateEntity>,
    private gqlWhereParsingService: GqlWhereParsingService,
  ) {}

  async find({
    first,
    skip,
    fromHead,
    where,
  }: BidAskUpdateFindProps): Promise<BidAskUpdate[]> {
    if (!where) {
      return (
        await this.bidAskUpdateRepository.find({
          take: first,
          skip: skip,
          order: {
            timestamp: fromHead ? 'DESC' : 'ASC',
          },
        })
      ).map((entity) => modelFromBidAskUpdateEntity(entity));
    }

    const queryBuilder =
      this.bidAskUpdateRepository.createQueryBuilder('bidAskUpdates');

    const metadata = this.bidAskUpdateRepository.metadata;

    this.gqlWhereParsingService.parse(queryBuilder, where, metadata);

    const bidAskUpdatesEntities = await queryBuilder
      .orderBy('timestamp', fromHead ? 'DESC' : 'ASC')
      .take(first)
      .skip(skip)
      .getMany();

    const bidAskUpdatesModels = bidAskUpdatesEntities.map((entity) =>
      modelFromBidAskUpdateEntity(entity),
    );

    return bidAskUpdatesModels;
  }
}
