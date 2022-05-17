
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
    private readonly coins: string[],
  ) { }

  private markets: IMarket[] = [];

  private async loadMarkets() {
    const rsp = await this.client.exchangeInfo();
    return (rsp.data.symbols as IMarket[])
      .filter((market) => market.status === 'TRADING');
  }

  public async Start() {
    this.markets = await this.loadMarkets();
    console.log(this.markets.length);
    // console.log(this.markets[0]);
  }
}
