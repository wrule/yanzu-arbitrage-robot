import ccxt from 'ccxt';
import { TickerWatcher } from './ticker_watcher';
import { Robot } from './robot';

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

  // const robot = new Robot(
  //   binance,
  //   'usdt',
  //   ['btc', 'eth', 'ada', 'link', 'uni', 'dent', 'fil'],
  // );
  // robot.Start();


  return;
  const watcher = new TickerWatcher(binance, ['DOGE/USDT', 'SHIB/USDT', 'SHIB/DOGE'], (ticker) => {
    const a = ticker['DOGE/USDT'].close as number;
    const b = ticker['SHIB/USDT'].close as number;
    const c = ticker['SHIB/DOGE'].close as number;
    const d = a * c;
    const e = (d - b) / b;
    console.log(b, d, e * 100);
  }, 1000);
  watcher.Start();
}

main();
