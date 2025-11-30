import { GraphQLScalarType } from 'graphql';

export const BigIntScalar = new GraphQLScalarType({
  name: 'BigInt',
  serialize(value: bigint): string {
    return value.toString();
  },
  parseValue(value: string): bigint {
    return BigInt(value);
  },
});
