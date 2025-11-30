import { Injectable } from '@nestjs/common';
import { isStraightParsable } from 'src/models/decorators';
import { EntityMetadata, ObjectLiteral, SelectQueryBuilder } from 'typeorm';

@Injectable()
export class GqlWhereParsingService {
  parse(
    queryBuilder: SelectQueryBuilder<ObjectLiteral>,
    where: object,
    metadata: EntityMetadata,
  ) {
    for (const [key, value] of Object.entries(where)) {
      if (!isStraightParsable(where, key)) {
        console.log('skipping: ', key);
        continue;
      }

      if (value === null || value === undefined) {
        continue;
      }

      console.log('adding to query: ', key, value);
      const [field, operatorSuffix] = key.split('_');
      const operator =
        { gt: '>', gte: '>=', lt: '<', lte: '<=', neq: '!=' }[operatorSuffix] ||
        '=';

      const column = metadata.findColumnWithPropertyName(field);
      if (!column) {
        continue;
      }
      console.log(column.databaseName);

      queryBuilder.andWhere(
        `${queryBuilder.alias}.${column.databaseName} ${operator} :${key}`,
        {
          [key]: value as string | number | boolean,
        },
      );
    }
  }
}
