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
  const watcher = new TickerWatcher(binance, ['BTC/USDT', 'LINK/USDT', 'LINK/BTC'], (ticker) => {
    const a = ticker['BTC/USDT'].close as number;
    const b = ticker['LINK/USDT'].close as number;
    const c = ticker['LINK/BTC'].close as number;
    console.log(a, b, c, b / a);
  }, 1000);
  watcher.Start();
}

main();
