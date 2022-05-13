import ccxt, { Ticker } from 'ccxt';
import fs from 'fs';
import moment from 'moment';

export
type TickerCallback = (ticker: ccxt.Dictionary<ccxt.Ticker>) => void;

export
class TickerWatcher {
  public constructor(
    private readonly exchange: ccxt.binance,
    private readonly symbols: string[],
    private readonly callback?: TickerCallback,
    private readonly interval: number = 5000,
  ) { }

  private timer: any = -1;

  private async loopQuery() {
    clearTimeout(this.timer);
    try {
      const result = await this.exchange.fetchTickers(this.symbols);
      if (this.callback) {
        this.callback(result);
      } else {
        console.log(result.datetime, result.close);
      }
    } catch (e) {
      console.error(e);
      fs.appendFileSync(
        `err-tk.log`,
        `[${
          moment().format('YYYY-MM-DD HH:mm:ss:SSS')
        }][${
          this.symbols.join(', ')
        }-${
          this.interval
        }]:\n${e}\n`);
    } finally {
      this.timer = setTimeout(() => {
        this.loopQuery();
      }, this.interval);
    }
  }

  public Start() {
    this.loopQuery();
  }

  public Stop() {
    clearTimeout(this.timer);
  }
}
