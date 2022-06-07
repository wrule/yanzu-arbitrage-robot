import { Spot } from '@binance/connector';
import secret from './.secret.json';

console.log('你好，世界');

async function main() {
  const client = new Spot(
    secret.API_KEY,
    secret.SECRET_KEY,
    { baseURL: 'https://api2.binance.com' },
  );
  const callbacks = {
    open: () => { console.log('open') },
    close: () => { console.log('close') },
    message: (json_text: string) => {
      try {
        const json_object = JSON.parse(json_text);
        const data = json_object.data;
        const [ask, bid] = [data.a, data.b];
        console.log(ask, bid);
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
