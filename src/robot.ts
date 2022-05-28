import { Market } from './market';
import { Pair, pair_to_key } from './utils';
import fs from 'fs';
import { AxiosResponse } from 'axios';
import { Ring } from './ring';

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

  private get_watch_streams() {
    const result: string[] = [];
    this.rings.forEach((ring) => {
      [
        ring.BaseMarket1.symbol,
        ring.BaseMarket2.symbol,
        ring.SwapMarket.symbol,
      ].forEach((symbol) => {
        result.push(`${symbol.toLowerCase()}@bookTicker`);
      });
    });
    return Array.from(new Set(result));
  }

  private rings: Ring[] = [];

  private get_watch_rings() {
    const result: Ring[] = [];
    this.pairs.forEach((pair) => {
      const base_market1 =
        this.market_map.get(`${pair[0]}${this.base}`) ||
        this.market_map.get(`${this.base}${pair[0]}`);
      const base_market2 =
        this.market_map.get(`${pair[1]}${this.base}`) ||
        this.market_map.get(`${this.base}${pair[1]}`);
      const swap_market =
        this.market_map.get(`${pair[0]}${pair[1]}`) ||
        this.market_map.get(`${pair[1]}${pair[0]}`);
      if (base_market1 && base_market2 && swap_market) {
        result.push(new Ring(base_market1, base_market2, swap_market));
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
      message: (json_text: any) => {
        const json_object = JSON.parse(json_text);
        const data = json_object.data;
        const symbol = data.s;
        const market = this.market_map.get(symbol);
        if (market) {
          market.UpdateBook([[data.a, data.A]], [[data.b, data.B]]);
          this.rings.forEach((ring) => {
            if (ring.MarketSymbols.includes(market.symbol)) {
              ring.Check();
              // console.log(market.SellPriceEst, market.BuyPriceEst);
            }
          });
        }
      },
    };
  }

  private combined_streams: any = null;

  public async Start() {
    this.market_map = await this.load_markets();
    this.rings = this.get_watch_rings();
    const streams = this.get_watch_streams();
    console.log(this.rings.length, streams);
    this.combined_streams = this.client.combinedStreams(
      streams,
      this.callbacks,
    );
  }
}
