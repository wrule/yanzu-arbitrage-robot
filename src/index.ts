import { Spot } from '@binance/connector';
import { Robot } from './robot';
import secret from './.secret.json';

async function main() {
  const client = new Spot(secret.API_KEY, secret.SECRET_KEY, { baseURL: 'https://api2.binance.com' });
  const robot = new Robot(
    client,
    'USDT',
    [
      ['BTC', 'GMT'],
      ['ETH', 'GMT'],
      ['BNB', 'GMT'],
      ['ETH', 'DENT'],
      ['BTC', 'DOGE'],
    ],
  );
  await robot.Start();
}

main();
