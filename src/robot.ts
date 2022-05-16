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

  private possibleSymbols() {
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

  private async legalSymbols() {
    const markets = await this.exchange.fetchMarkets();
    const market_symbols = markets.map((market) => market.symbol.toUpperCase());
    const possible_symbols = this.possibleSymbols();
    const legal_symbols = possible_symbols.filter((symbol) => market_symbols.includes(symbol));
    return legal_symbols;
  }

  private pairs: string[] = [];

  public async Start() {
    const legal_symbols = await this.legalSymbols();
    console.log(legal_symbols);
  }

  public Stop() {

  }
}
