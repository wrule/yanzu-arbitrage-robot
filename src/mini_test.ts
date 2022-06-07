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
      console.log(json_text);
    },
  };
  const combined_streams = client.combinedStreams(
    ['btcusdt@@bookTicker'],
    callbacks,
  );
}

main();
