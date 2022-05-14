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
}

main();
