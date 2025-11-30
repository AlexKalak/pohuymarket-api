const STRAIGHT_PARSABLE_KEY = Symbol('straight_prasable');

export function StraightParsable() {
  return function (target: any, propertyKey: any) {
    Reflect.defineMetadata(STRAIGHT_PARSABLE_KEY, true, target, propertyKey);
  };
}

export function isStraightParsable(target: any, propertyKey: string) {
  return (
    Reflect.getMetadata(STRAIGHT_PARSABLE_KEY, target, propertyKey) === true
  );
}
