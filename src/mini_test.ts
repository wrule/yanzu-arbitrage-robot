import { Spot } from '@binance/connector';
import secret from './.secret.json';

console.log('你好，世界');

async function main() {
  const client = new Spot(
    secret.API_KEY,
    secret.SECRET_KEY,
    { baseURL: 'https://api2.binance.com' },
  );
  let time = -1;
  let count = 0;
  const callbacks = {
    open: () => { console.log('open') },
    close: () => { console.log('close') },
    message: (json_text: string) => {
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
          } else {
            console.log('买', ask, bid);
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
