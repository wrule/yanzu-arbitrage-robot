
export
interface IMarket {
  symbol: string;
  status: string;
  baseAsset: string;
  quoteAsset: string;
}

export
class Robot {
  public constructor(
    private readonly client: any,
    private readonly base: string,
    private readonly coins: string[] = [],
  ) { }

  private markets: IMarket[] = [];
  private market_all_coins: string[] = [];

  private get_market_all_coins() {
    const result: string[] = [];
    this.markets.forEach((market) => {
      result.push(market.baseAsset);
      result.push(market.quoteAsset);
    });
    return Array.from(new Set(result));
  }

  private async load_markets() {
    const rsp = await this.client.exchangeInfo();
    return (rsp.data.symbols as IMarket[])
      .filter((market) => market.status === 'TRADING');
  }

  private watch_markets: [IMarket, IMarket, IMarket][] = [];

  private get_watch_markets() {

  }

  public async Start() {
    this.markets = await this.load_markets();
    this.market_all_coins = this.get_market_all_coins();
    console.log(this.market_all_coins.length);
    // console.log(this.markets[0]);
  }
}
