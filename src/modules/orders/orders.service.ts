import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { KalshiOrderEntity, KalshiOrderFill, KalshiOrderFillEntity, kalshiOrderFillEntityToModel, PolymarketOrderEntity, PolymarketOrderFill, PolymarketOrderFillEntity, polymarketOrderFillEntityToModel } from './orders.model';

@Injectable()
export class OrdersService {
  constructor(
    @Inject('POLYMARKET_ORDERS_REPO')
    private polymarketOrdersRepo: Repository<PolymarketOrderEntity>,
    @Inject('KALSHI_ORDERS_REPO')
    private kalshiOrdersRepo: Repository<KalshiOrderEntity>,
    @Inject('POLYMARKET_ORDER_FILLS_REPO')
    private polymarketOrderFillsRepo: Repository<PolymarketOrderFillEntity>,
    @Inject('KALSHI_ORDER_FILLS_REPO')
    private kalshiOrderFillsRepo: Repository<KalshiOrderFillEntity>,
  ) { }

  public async getPolymarketOrderFillsForMarket(marketIdentificator: string): Promise<PolymarketOrderFill[]> {
    const orderFills = await this.polymarketOrderFillsRepo.find({
      where: {
        polymarketMarketIdentificator: marketIdentificator
      }
    })

    return orderFills.map(entity => polymarketOrderFillEntityToModel(entity))
  }

  public async getKalshiOrderFillsForMarket(marketTicker: string): Promise<KalshiOrderFill[]> {
    const orderFills = await this.kalshiOrderFillsRepo.find({
      where: {
        kalshiMarketTicker: marketTicker
      }
    })

    return orderFills.map(entity => kalshiOrderFillEntityToModel(entity))
  }
}
