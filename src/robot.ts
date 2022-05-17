
export
interface IMarket {
  symbol: string;
  status: string;
  baseAsset: string;
  quoteAsset: string;
}

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

  private markets: IMarket[] = [];

  private async load_markets() {
    const rsp = await this.client.exchangeInfo();
    return rsp.data.symbols as IMarket[];
  }

  private watch_markets: IMarket[] = [];

  private market_pair(market: IMarket) {
    return [market.baseAsset, market.quoteAsset] as Pair;
  }

  private try_push_watch_markets(market: IMarket) {
    if (
      this.watch_markets.every(
        (item) =>
          !this.pairs_equal(this.market_pair(item), this.market_pair(market))
      )
    ) {
      this.watch_markets.push(market);
    }
  }

  private get_watch_markets() {
    const result: IMarket[] = [];
    this.pairs.forEach((pair) => {

    });
    return result;
  }

  public async Start() {
    this.markets = await this.load_markets();
    console.log(this.pairs_coin);
  }
}
