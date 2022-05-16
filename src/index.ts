import ccxt from 'ccxt';
import { TickerWatcher } from './ticker_watcher';
import { Robot } from './robot';
import { Spot } from '@binance/connector';
import fs from 'fs';

async function main() {
  // client.partialBookDepth('btcusdt', 5, '1000ms', callbacks);
  // client.bookTickerWS('btcusdt', callbacks);
  // client.diffBookDepth('ethusdt', '100ms', callbacks);
  // client.partialBookDepth('btcusdt', 5, '100ms', callbacks);

  // unsubscribe the stream above
  // setTimeout(() => client.unsubscribe(aggTrade), 3000)

  // support combined stream
  // const combinedStreams = client.combinedStreams(['btcusdt@miniTicker', 'ethusdt@tikcer'], callbacks)

  const binance = new ccxt.binance({
    // apiKey: Secret.API_KEY,
    // secret: Secret.SECRET_KEY,
    // enableRateLimit: true,
    // options: {
    //   defaultType: 'future',
    // },
  });
  const client = new Spot();
  const robot = new Robot(
    binance,
    client,
    'usdt',
    ['btc', 'eth', 'ada', 'link', 'uni', 'dent', 'fil'],
  );
  robot.Start();
}

main();
