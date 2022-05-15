import ccxt from 'ccxt';
import { TickerWatcher } from './ticker_watcher';
import { Robot } from './robot';
const { Spot } = require('@binance/connector');
import fs from 'fs';

async function main() {

  const client = new Spot()

  const callbacks = {
    open: () => client.logger.log('open'),
    close: () => client.logger.log('closed'),
    message: (data: any) => {
      console.log(data);
      const jsonObject = JSON.parse(data);
      fs.writeFileSync('3.json', JSON.stringify(jsonObject, null, 2));
      // const jsonObject = JSON.parse(data);
      // console.log(jsonObject.p);
    },
  }
  // client.aggTradeWS('btcusdt', callbacks)
  // client.partialBookDepth('btcusdt', 5, '1000ms', callbacks);
  // client.bookTickerWS('btcusdt', callbacks);
  // client.diffBookDepth('btcusdt', '100ms', callbacks);
  client.partialBookDepth('btcusdt', 5, '100ms', callbacks);

  // unsubscribe the stream above
  // setTimeout(() => client.unsubscribe(aggTrade), 3000)

  // support combined stream
  // const combinedStreams = client.combinedStreams(['btcusdt@miniTicker', 'ethusdt@tikcer'], callbacks)




  // const binance = new ccxt.binance({
    // apiKey: Secret.API_KEY,
    // secret: Secret.SECRET_KEY,
    // enableRateLimit: true,
    // options: {
    //   defaultType: 'future',
    // },
  // });

  // const robot = new Robot(
  //   binance,
  //   'usdt',
  //   ['btc', 'eth', 'ada', 'link', 'uni', 'dent', 'fil'],
  // );
  // robot.Start();
}

main();
