import { Market } from './market';

export
type Pair = [string, string];

export
class Robot {
  public constructor(
    private readonly client: any,
    private readonly base: string,
    private readonly pairs: Pair[] = [],
  ) { }

  private pairs_equal(pair1: Pair, pair2: Pair) {
    return (
      pair1[0] === pair2[0] &&
      pair1[1] === pair2[1]
    ) || (
      pair1[0] === pair2[1] &&
      pair1[1] === pair2[0]
    );
  }

  private get pairs_coin() {
    const result: string[] = [];
    this.pairs.forEach((pair) => {
      result.push(pair[0]);
      result.push(pair[1]);
    });
    return Array.from(new Set(result));
  }

  private market_map!: Map<string, Market>;

  private async load_markets() {
    const rsp = await this.client.exchangeInfo();
    const markets = (rsp.data.symbols as any[]).map((item) => new Market(item));
    return new Map<string, Market>(markets.map((market) => [market.Key, market]));
  }

  private get_watch_markets() {

  }

  public async Start() {
    this.market_map = await this.load_markets();
    console.log(this.pairs_coin);
  }
}
