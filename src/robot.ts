import ccxt from 'ccxt';

export
class Robot {
  public constructor(
    private readonly exchange: ccxt.binance,
    private readonly client: any,
    private readonly base: string,
    private readonly coins: string[],
  ) { }

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

  public async Start() {
    const legal_symbols = await this.legalSymbols();
    console.log(legal_symbols);
    const callbacks = {
      open: () => this.client.logger.log('open'),
      close: () => this.client.logger.log('closed'),
      message: (data: any) => {
        const jsonObject = JSON.parse(data);
        console.log(jsonObject.data);
      },
    };
    this.client.combinedStreams(['btcusdt@depth@100ms'], callbacks);
    // this.client.aggTradeWS('linkusdt', callbacks);
    // legal_symbols.forEach((symbol) => {
    //   this.client.aggTradeWS(symbol.replace('/', ''), callbacks);
    // });
  }

  public Stop() {

  }
}
