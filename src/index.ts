import ccxt from 'ccxt';
import { TickerWatcher } from './ticker_watcher';
import { Robot } from './robot';
const { Spot } = require('@binance/connector')

async function main() {

  const client = new Spot('', '', {
    wsURL: 'wss://testnet.binance.vision' // If optional base URL is not provided, wsURL defaults to wss://stream.binance.com:9443
  })

  const callbacks = {
    open: () => client.logger.log('open'),
    close: () => client.logger.log('closed'),
    message: (data: any) => client.logger.log(data)
  }
  const aggTrade = client.aggTradeWS('bnbusdt', callbacks)

  // unsubscribe the stream above
  setTimeout(() => client.unsubscribe(aggTrade), 3000)

  // support combined stream
  const combinedStreams = client.combinedStreams(['btcusdt@miniTicker', 'ethusdt@tikcer'], callbacks)




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
