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
  const watcher = new TickerWatcher(binance, ['BTC/USDT', 'ADA/USDT', 'ADA/BTC'], (ticker) => {
    console.log(
      'BTC/USDT', ticker['BTC/USDT'].close,
      'ADA/USDT', ticker['ADA/USDT'].close,
      'ADA/BTC', ticker['ADA/BTC'].close,
    );
  }, 1000);
  watcher.Start();
}

main();
