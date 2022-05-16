import ccxt, { Market } from 'ccxt';
import { TickerWatcher } from './ticker_watcher';

export
class Robot {
  public constructor(
    private readonly exchange: ccxt.binance,
    private readonly base: string,
    private readonly coins: string[],
  ) { }

  private markets: Market[] = [];

  private async init() {
    const markets = await this.exchange.fetchMarkets();
    const market_symbols = markets.map((market) => market.symbol.toUpperCase());


    // console.log(market_symbols);


    const possible_symbols = this.allPairs();
    console.log(possible_symbols);
    // const legal_symbols = possible_symbols.filter((symbol) => market_symbols.includes(symbol));



    // console.log(legal_symbols);
    // const watcher = new TickerWatcher(this.exchange, legal_symbols, (dict) => {
    //   console.log(1);
    // }, 1000);
    // watcher.Start();
  }

  private allPairs() {
    const result: string[] = [];
    result.push(...(
      this.coins.map((coin) => `${coin}/${this.base}`.toUpperCase())
    ));
    for (let i = 0; i < this.coins.length - 1; ++i) {
      for (let j = i + 1; j < this.coins.length; ++j) {
        result.push(`${this.coins[i]}/${this.coins[j]}`.toUpperCase());
        result.push(`${this.coins[j]}/${this.coins[i]}`.toUpperCase());
      }
    }
    return Array.from(new Set(result));
  }

  private pairs: string[] = [];

  public Start() {
    this.init();
  }

  public Stop() {

  }
}
