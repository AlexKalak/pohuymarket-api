export function getBidAskUpdateTrigger(marketIdentificator: string): string {
  return `${marketIdentificator}_bidAskUpdate`;
}
