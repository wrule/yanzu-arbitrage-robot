import { Market } from './market';
import { Pair, pair_to_key } from './utils';
import fs from 'fs';

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
    const markets = (rsp.data.symbols as any[]).map((item) => new Market(this.client, item));
    return new Map<string, Market>(markets.map((market) => [market.Key, market]));
  }

  private watch_market_map!: Map<string, Market>;

  private get watch_market_streams() {
    return Array.from(
      this.watch_market_map.values())
        .map((market) => `${market.symbol.toLowerCase()}@depth@100ms`
    );
  }

  private get_watch_markets() {
    const result = new Map<string, Market>();
    this.pairs.forEach((pair) => {
      const keys = [
        pair_to_key([pair[0], this.base]),
        pair_to_key([pair[1], this.base]),
        pair_to_key(pair),
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
      message: (data: any) => {
        const jsonObject = JSON.parse(data);
        fs.writeFileSync('1.json', JSON.stringify(jsonObject, null, 2));
        console.log(data);
      },
    };
  }

  private combined_streams: any = null;

  public async Start() {
    this.market_map = await this.load_markets();
    this.watch_market_map = this.get_watch_markets();
    this.symbol_markets = this.get_symbol_markets();
    console.log(this.watch_market_streams);

    // const ab = this.market_map.get('LINK/USDT') as Market;
    // const bc = this.market_map.get('ETH/LINK') as Market;
    // const ca = this.market_map.get('ETH/USDT') as Market;

    // try {
    //   const old_time = Number(new Date());
    //   const result1 = await ab.Buy(20);
    //   result1.Display();
    //   const result2 = await bc.Sell(result1.OutQuantity);
    //   result2.Display();
    //   const result3 = await ca.Sell(result2.OutQuantity);
    //   result3.Display();
    //   console.log(Number(new Date()) - old_time);
    // } catch (e: any) {
    //   console.error(e);
    // }


    // console.log(Array.from(this.symbol_markets.keys()));
    // console.log(Array.from(this.symbol_markets.values())[0]);


    this.combined_streams = this.client.combinedStreams(
      ['btcusdt@bookTicker'],
      // this.watch_market_streams,
      this.callbacks,
    );
    // this.client.aggTradeWS('btcusdt', this.callbacks);
  }
}
