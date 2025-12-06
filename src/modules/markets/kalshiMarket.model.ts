import {
  Entity,
  Column,
  Index,
  Unique,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { KalshiEvent, KalshiEventEntity } from '../events/kalshiEvent.model';

import { MarketType, type IMarket } from './market.interface';
import { type IEvent } from '../events/event.interface';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class KalshiMarket implements IMarket {
  @Field(() => String, { nullable: true })
  ticker!: string;

  @Field(() => String, { nullable: true })
  event_ticker!: string;

  @Field(() => String, { nullable: true })
  title!: string;

  @Field(() => String, { nullable: true })
  createdTime!: Date;

  @Field(() => Date, { nullable: true })
  closeTime!: Date;

  @Field(() => String, { nullable: true })
  marketType!: string;

  @Field(() => Boolean, { nullable: true })
  closed!: boolean;

  @Field(() => KalshiEvent, { nullable: true })
  event!: Promise<KalshiEvent>;

  Downcast(): any {
    return this;
  }
  GetEvent(): Promise<IEvent> {
    return this.event;
  }
  GetIsClosed(): boolean {
    return this.closed;
  }
  GetEnd(): Date {
    return this.closeTime;
  }
  GetStart(): Date {
    return this.createdTime;
  }
  GetQuestion(): string {
    return 'Question getting from kalshi markets not implemented yet, slomayte progeru ebalo :( ';
  }
  GetTitle(): string {
    return this.title;
  }
  GetIdentificator(): string {
    return this.ticker;
  }
  GetMarketType(): MarketType {
    return MarketType.Kalshi;
  }
}

@Entity('kalshi_markets')
@Unique(['ticker'])
export class KalshiMarketEntity {
  @Index()
  @PrimaryColumn('varchar')
  ticker!: string;

  @Index()
  @Column('varchar')
  event_ticker!: string;

  @Index()
  @Column('varchar')
  title!: string;

  @Column('timestamptz')
  createdTime!: Date;

  @Column('timestamptz')
  closeTime!: Date;

  @Column({ type: 'varchar' })
  marketType!: string;

  @Column({ type: 'boolean' })
  closed!: boolean;

  @ManyToOne(() => KalshiEventEntity)
  @JoinColumn({ name: 'event_ticker', referencedColumnName: 'ticker' })
  event!: Promise<KalshiEventEntity>;

  toModel(): KalshiMarket {
    const model = new KalshiMarket();
    model.ticker = this.ticker;
    model.event_ticker = this.event_ticker;
    model.title = this.title;
    model.createdTime = this.createdTime;
    model.closeTime = this.closeTime;
    model.marketType = this.marketType;
    model.closed = this.closed;
    model.event = this.event?.then((event) => event?.toModel());

    return model;
  }
}

@Entity('kalshi_clob_scaning_markets')
@Unique(['id'])
export class KalshiClobScanningMarket {
  @Index()
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn()
  createdAt!: Date; // auto-set on INSERT

  @UpdateDateColumn()
  updatedAt!: Date; // auto-set on UPDATE

  @Index()
  @Column('int')
  kalshiMarketTicker!: string;

  @OneToOne(() => KalshiMarket)
  @JoinColumn({ name: 'kalshiMarketTicker', referencedColumnName: 'ticker' })
  market!: Promise<KalshiMarket>;
}
