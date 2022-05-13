import ccxt from 'ccxt';
import { TickerWatcher } from './ticker_watcher';

console.log('你好，世界');

async function main() {
  const binance = new ccxt.binance({
    // apiKey: Secret.API_KEY,
    // secret: Secret.SECRET_KEY,
    // enableRateLimit: true,
    // options: {
    //   defaultType: 'future',
    // },
  });
  const watcher = new TickerWatcher(binance, ['BTCUSDT'], (ticker) => {
    console.log(ticker);
  }, 1000);
  watcher.Start();
}

main();
