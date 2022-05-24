import { Market } from './market';
import { Pair, pair_to_key } from './utils';
import fs from 'fs';
import { AxiosResponse } from 'axios';

export
class Robot {
  public constructor(
    private readonly client: any,
    private readonly base: string,
    private readonly pairs: Pair[] = [],
  ) { }

  private market_map!: Map<string, Market>;

  /**
   * 加载可用市场
   * @returns 可用市场Map
   */
  private async load_markets() {
    const rsp: AxiosResponse<any, any> = await this.client.exchangeInfo();
    const markets = (rsp.data.symbols as any[])
      .map((item) => new Market(this.client, item));
    return new Map<string, Market>(
      markets.map((market) => [market.symbol, market])
    );
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
      const base_market1 = this.market_map.get(``) || this.market_map.get(``);
      const base_market2 = this.market_map.get(``) || this.market_map.get(``);
      const swap_market = this.market_map.get(``) || this.market_map.get(``);
      if (base_market1 && base_market2 && swap_market) {

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
        fs.writeFileSync('3.json', JSON.stringify(jsonObject, null, 2));
        console.log(data);
      },
    };
  }

  private combined_streams: any = null;

  public async Start() {
    this.market_map = await this.load_markets();
    this.watch_market_map = this.get_watch_markets();
    this.symbol_markets = this.get_symbol_markets();
    console.log(this.market_map.size);

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


    // this.combined_streams = this.client.combinedStreams(
    //   ['btcusdt@depth20@100ms'],
    //   // this.watch_market_streams,
    //   this.callbacks,
    // );
    // this.client.aggTradeWS('btcusdt', this.callbacks);
  }
}
