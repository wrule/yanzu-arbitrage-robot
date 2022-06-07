import { Spot } from '@binance/connector';
import { AxiosResponse } from 'axios';
import secret from './.secret.json';
import { Market } from './market';
import { TransactionResultBuy } from './transaction_result';

console.log('你好，世界');


async function load_markets(client: any) {
  const rsp: AxiosResponse<any, any> = await client.exchangeInfo();
  const markets = (rsp.data.symbols as any[])
    .map((item) => new Market(client, item));
  return new Map<string, Market>(
    markets.map((market) => [market.symbol, market])
  );
}

async function main() {
  const client = new Spot(
    secret.API_KEY,
    secret.SECRET_KEY,
    { baseURL: 'https://api2.binance.com' },
  );
  const market_map = await load_markets(client);
  const marker = market_map.get('BTCUSDT') as Market;
  let time = -1;
  let count = 0;
  let result!: TransactionResultBuy;
  const callbacks = {
    open: () => { console.log('open') },
    close: () => { console.log('close') },
    message: async (json_text: string) => {
      try {
        if (time < 0) {
          time = Number(new Date());
          console.log(time, '就绪');
          return;
        }
        const now_time = Number(new Date());
        if (now_time - time > 1000 * 10) {
          time = now_time;
          const json_object = JSON.parse(json_text);
          const data = json_object.data;
          const [ask, bid] = [data.a, data.b];
          if (count % 2) {
            console.log('卖', ask, bid);
            const sell_result = await marker.Sell(result.OutQuantity);
            sell_result.Display();
          } else {
            console.log('买', ask, bid);
            result = await marker.Buy(15);
            result.Display();
          }
          count++;
        }
      } catch (e) {
        console.error(e);
      }
    },
  };
  const combined_streams = client.combinedStreams(
    ['btcusdt@bookTicker'],
    callbacks,
  );
}

main();
