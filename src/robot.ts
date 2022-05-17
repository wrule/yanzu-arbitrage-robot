import { Market } from './market';
import { Pair, pair_to_key } from './utils';

export
class Robot {
  public constructor(
    private readonly client: any,
    private readonly base: string,
    private readonly pairs: Pair[] = [],
  ) { }

  private market_map!: Map<string, Market>;

  private async load_markets() {
    const rsp = await this.client.exchangeInfo();
    const markets = (rsp.data.symbols as any[]).map((item) => new Market(item));
    return new Map<string, Market>(markets.map((market) => [market.Key, market]));
  }

  private get_watch_markets() {
    const result = new Map<string, Market>();
    this.pairs.forEach((pair) => {
      const keys = [
        pair_to_key(pair),
        pair_to_key([pair[0], this.base]),
        pair_to_key([pair[1], this.base]),
      ];
      if (keys.every((key) => this.market_map.has(key))) {
        keys.forEach((key) => {
          const market = this.market_map.get(key) as Market;
          if (!result.has(key)) {
            result.set(key, market);
          }
        });
      }
    });
    return result;
  }

  public async Start() {
    this.market_map = await this.load_markets();
    console.log(Array.from(this.market_map.keys()).length);
  }
}
