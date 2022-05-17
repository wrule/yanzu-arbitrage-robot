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

  private watch_market_map!: Map<string, Market>;

  private get watch_market_streams() {
    return Array.from(
      this.watch_market_map.values())
        .map((market) => `${market.symbol}@depth@100ms`
    );
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

  private symbol_markets!: Map<string, Market>;

  private get_symbol_markets() {
    return new Map<string, Market>(
      Array.from(this.watch_market_map.values())
        .map((market) => ([market.symbol, market]))
    );
  }

  private get callbacks() {
    return {
      open: () => this.client.logger.log('open'),
      close: () => this.client.logger.log('closed'),
      message: (data: any) => this.client.logger.log(data),
    };
  }

  private combined_streams: any = null;

  public async Start() {
    this.market_map = await this.load_markets();
    this.watch_market_map = this.get_watch_markets();
    this.symbol_markets = this.get_symbol_markets();
    console.log(this.watch_market_streams);
    console.log(Array.from(this.symbol_markets.keys()));
    // this.combined_streams = this.client.combinedStreams(
    //   this.watch_market_streams,
    //   this.callbacks,
    // );
  }
}
