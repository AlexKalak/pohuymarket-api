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

export const DateScalar = new GraphQLScalarType({
  name: 'DateScalar',
  serialize(value: Date): string {
    if (!value) {
      return new Date().toISOString();
    }
    return value.toISOString();
  },

  parseValue(value: string): Date {
    const date = new Date(value);

    if (isNaN(date.getTime())) {
      throw new Error(`Invalid DateTime value: '${value}'`);
    }
    return date;
  },
});
