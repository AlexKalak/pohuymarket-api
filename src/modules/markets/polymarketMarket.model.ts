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

import { MarketType, type IMarket } from './market.interface';
import { type IEvent } from '../events/event.interface';
import {
  PolymarketEvent,
  PolymarketEventEntity,
} from '../events/polymarketEvent.model';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PolymarketMarket implements IMarket {
  @Field(() => Int, { nullable: true })
  id!: number;

  @Field(() => String, { nullable: true })
  conditionId!: string;

  @Field(() => Int, { nullable: true })
  event_id!: number;

  @Field(() => String, { nullable: true })
  slug!: string;

  @Field(() => String, { nullable: true })
  question!: string;

  @Field(() => Date, { nullable: true })
  startDate!: Date;

  @Field(() => Date, { nullable: true })
  endDate!: Date;

  @Field(() => String, { nullable: true })
  image!: string;

  @Field(() => String, { nullable: true })
  icon!: string;

  @Field(() => String, { nullable: true })
  yesAssetId!: string;

  @Field(() => String, { nullable: true })
  noAssetId!: string;

  @Field(() => Boolean, { nullable: true })
  negRisk!: boolean;

  @Field(() => String, { nullable: true })
  negRiskMarketID!: string;

  @Field(() => String, { nullable: true })
  negRiskRequestID!: string;

  @Field(() => Boolean, { nullable: true })
  active!: boolean;

  @Field(() => Boolean, { nullable: true })
  closed!: boolean;

  @Field(() => PolymarketEvent, { nullable: true })
  event!: Promise<PolymarketEvent>;

  Downcast() {
    return this;
  }
  GetEvent(): Promise<IEvent> {
    return this.event;
  }
  GetIsClosed(): boolean {
    return this.closed;
  }
  GetEnd(): Date {
    return this.endDate;
  }
  GetStart(): Date {
    return this.startDate;
  }
  GetQuestion(): string {
    return this.question;
  }
  GetTitle(): string {
    return this.slug;
  }
  GetIdentificator(): string {
    return this.id.toString();
  }
  GetMarketType(): MarketType {
    return MarketType.Polymarket;
  }
}

@Entity('polymarket_markets')
@Unique(['id'])
export class PolymarketMarketEntity {
  @Index()
  @PrimaryColumn('int')
  id!: number;

  @Index()
  @PrimaryColumn('varchar')
  conditionId!: string;

  @Index()
  @Column('int')
  event_id!: number;

  @Index()
  @Column('varchar')
  slug!: string;

  @Column('varchar')
  question!: string;

  @Column('timestamptz')
  startDate!: Date;

  @Column('timestamptz')
  endDate!: Date;

  @Index()
  @Column('varchar')
  image!: string;

  @Column({ type: 'varchar' })
  icon!: string;

  @Column({ type: 'varchar' })
  yesAssetId!: string;

  @Column({ type: 'varchar' })
  noAssetId!: string;

  @Column({ type: 'boolean' })
  negRisk!: boolean;

  @Column({ type: 'varchar' })
  negRiskMarketID!: string;

  @Column({ type: 'varchar' })
  negRiskRequestID!: string;

  @Column({ type: 'boolean' })
  active!: boolean;

  @Column({ type: 'boolean' })
  closed!: boolean;

  @ManyToOne(() => PolymarketEventEntity)
  @JoinColumn({ name: 'event_id', referencedColumnName: 'id' })
  event!: Promise<PolymarketEventEntity>;

  toModel(): PolymarketMarket {
    const model = new PolymarketMarket();
    model.id = this.id;
    model.conditionId = this.conditionId;
    model.event_id = this.event_id;
    model.slug = this.slug;
    model.question = this.question;
    model.startDate = this.startDate;
    model.endDate = this.endDate;
    model.image = this.image;
    model.icon = this.icon;
    model.yesAssetId = this.yesAssetId;
    model.noAssetId = this.noAssetId;
    model.negRisk = this.negRisk;
    model.negRiskMarketID = this.negRiskMarketID;
    model.negRiskRequestID = this.negRiskRequestID;
    model.active = this.active;
    model.closed = this.closed;
    model.event = this.event?.then((eventEntity) => eventEntity?.toModel());

    return model;
  }
}

@Entity('polymarket_clob_scaning_markets')
@Unique(['id'])
export class PolymarketClobScanningMarket {
  @Index()
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn()
  createdAt!: Date; // auto-set on INSERT

  @UpdateDateColumn()
  updatedAt!: Date; // auto-set on UPDATE

  @Index()
  @Column('int')
  polymarketMarketId!: number;

  @Index()
  @Column('varchar')
  polymarketMarketConditionId!: string;

  @OneToOne(() => PolymarketMarket)
  @JoinColumn({ name: 'polymarketMarketId', referencedColumnName: 'id' })
  market!: Promise<PolymarketMarket>;
}
