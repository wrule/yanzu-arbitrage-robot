import { Market } from './market';
import { Pair } from './utils';

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

  public async Start() {
    this.market_map = await this.load_markets();
  }
}
