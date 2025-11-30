import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { BigIntScalar } from 'src/modules/gql/gql.scalars';
import { Entity, PrimaryGeneratedColumn, Column, Index, Unique } from 'typeorm';
import { StraightParsable } from './decorators';

@InputType()
export class OrdersMatchWhere {
  @Field({ nullable: true })
  @StraightParsable()
  id?: number;

  @Field({ nullable: true })
  @StraightParsable()
  transactionHash?: string;

  @Field({ nullable: true })
  @StraightParsable()
  blockNumber?: number;

  @Field({ nullable: true })
  @StraightParsable()
  pairAddress?: string;

  @Field({ nullable: true })
  @StraightParsable()
  timestamp?: number;

  @Field({ nullable: true })
  @StraightParsable()
  takerAssetId?: string;

  @Field({ nullable: true })
  @StraightParsable()
  makerAssetId?: string;

  @Field({ nullable: true })
  takerOrMakerAssetId?: string;
}

@ObjectType()
@Entity('orders_match_events')
@Unique(['transactionHash', 'logIndex'])
export class OrdersMatch {
  @Field(() => Int, { nullable: true })
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => String, { nullable: true })
  @Column('varchar')
  transactionHash!: string;

  @Field(() => Int, { nullable: true })
  @Column('int')
  logIndex!: number;

  @Field(() => Int, { nullable: true })
  @Index()
  @Column('int')
  blockNumber!: number;

  @Field(() => Int, { nullable: true })
  @Index()
  @Column('int')
  timestamp!: number;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar' })
  takerOrderMaker!: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar' })
  makerAssetId!: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar' })
  takerAssetId!: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar' })
  takerOrderHash!: string;

  @Field(() => BigIntScalar, { nullable: true })
  @Column('numeric', {
    transformer: {
      to: (value: bigint | string) => value.toString(),
      from: (value: string) => BigInt(value),
    },
  })
  makerAmountFilled!: bigint;

  @Field(() => BigIntScalar, { nullable: true })
  @Column('numeric', {
    transformer: {
      to: (value: bigint | string) => value.toString(),
      from: (value: string) => BigInt(value),
    },
  })
  takerAmountFilled!: bigint;

  @Field(() => Int, { nullable: true })
  @Column('int')
  sharePrice!: number; //scaled by 1000
}
