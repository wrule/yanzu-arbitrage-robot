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
    const possible_symbols = this.allPairs();
    const legal_symbols = possible_symbols.filter((symbol) => market_symbols.includes(symbol));
    console.log(legal_symbols);
    const watcher = new TickerWatcher(this.exchange, legal_symbols, (dict) => {
      console.log(1);
    }, 1000);
    watcher.Start();
  }

  private allPairs() {
    const result: string[] = [];
    const all_coins = Array.from(new Set(this.coins.concat(this.base)));
    for (let i = 0; i < all_coins.length - 1; ++i) {
      for (let j = i + 1; j < all_coins.length; ++j) {
        result.push(`${all_coins[i]}/${all_coins[j]}`.toUpperCase());
        result.push(`${all_coins[j]}/${all_coins[i]}`.toUpperCase());
      }
    }
    return result;
  }

  private pairs: string[] = [];

  public Start() {
    this.init();
  }

  public Stop() {

  }
}
