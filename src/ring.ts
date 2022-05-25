import { Market } from './market';

export
class Ring {
  public constructor(
    private readonly base_market1: Market,
    private readonly base_market2: Market,
    private readonly swap_market: Market,
  ) { }

  public get BaseMarket1() {
    return this.base_market1;
  }

  public get BaseMarket2() {
    return this.base_market2;
  }

  public get SwapMarket() {
    return this.swap_market;
  }

  public get MarketSymbols() {
    return [
      this.base_market1.symbol,
      this.base_market2.symbol,
      this.swap_market.symbol,
    ];
  }

  public Check() {
    console.log(
      this.base_market1.symbol,
      this.base_market1.SellPriceEst,
      this.base_market1.BuyPriceEst,
      this.base_market2.symbol,
      this.swap_market.symbol,
    );
  }
}
