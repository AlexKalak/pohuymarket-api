import {
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import Redis from 'ioredis';
import { RedisBestBidAskUpdateStreamEntity } from 'src/datasources/redis/redis.entities/redis.bidAskUpdate.entity';
import { REDIS_CLIENT } from 'src/datasources/redis/redis.providers';
import { BID_ASK_EVENTS } from 'src/events/events';

type XReadGroupResponse = [string, [string, string[]][]][] | null;

@Injectable()
export class BidAskUpdateListenerService
  implements OnModuleInit, OnModuleDestroy
{
  constructor(
    @Inject(REDIS_CLIENT)
    private redisProvider: Redis,
    private eventEmitter: EventEmitter2,
  ) {}

  private readonly logger = new Logger();

  private stream = 'best_bid_ask_update';
  private consumerGroup = 'nest_bid_ask_udpate_listener_group';
  private consumer = `nest_bid_ask_update_listner_consumer_${process.pid}`;
  private isListening = false;
  private lastReadID = '';

  onModuleInit() {
    this.isListening = true;
    this.listenToBidAskUpdateStream().catch((e) => {
      console.log('BidAskUpdateListener failed: ', e);
    });
  }

  onModuleDestroy() {
    this.isListening = false;
  }

  private async listenToBidAskUpdateStream() {
    try {
      await this.redisProvider.xgroup(
        'CREATE',
        this.stream,
        this.consumerGroup,
        '0',
      );
    } catch (e) {
      this.logger.error(e);
      // if (e.message.includes('BUSYGROUP')) throw e;
    }

    this.logger.log('Listening for new bidAskUpdates');

    while (this.isListening) {
      const response = (await this.redisProvider.xreadgroup(
        'GROUP',
        this.consumerGroup,
        this.consumer,
        'COUNT',
        10,
        'BLOCK',
        5000,
        'STREAMS',
        this.stream,
        '>',
      )) as XReadGroupResponse;

      await this.handleReadGroupResponse(response);
    }
  }

  private async handleReadGroupResponse(response: XReadGroupResponse) {
    if (!response) {
      return;
    }
    for (const [streamName, messages] of response) {
      for (const [id, message] of messages) {
        const entity = new RedisBestBidAskUpdateStreamEntity(message);

        console.log(`${streamName} -> ${id}`, entity);

        try {
          console.log('new bidAskUpdate entity: ', entity);

          const bidAskUpdate = entity.ToModel();

          console.log('new bidAskUpdate: ', bidAskUpdate);

          this.eventEmitter.emit(
            BID_ASK_EVENTS.BidAskUpdateEvent,
            bidAskUpdate,
          );

          await this.redisProvider.xack(this.stream, this.consumerGroup, id);
          this.lastReadID = id;
        } catch {
          continue;
        }
      }
    }
  }
}
