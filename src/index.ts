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
      // ['BNB', 'GMT'],
      ['ETH', 'DENT'],
      ['BTC', 'DOGE'],
      ['SHIB', 'DOGE'],
      ['BTC', 'SUSHI'],
      // ['BNB', 'SUSHI'],
      ['BTC', 'YFI'],
      ['BTC', 'YFII'],
      ['BTC', 'CAKE'],
      // ['BNB', 'CAKE'],
      ['BTC', 'TRX'],
      ['ETH', 'TRX'],
      // ['BNB', 'TRX'],
      ['BTC', 'C98'],
      // ['BNB', 'C98'],
      ['BTC', 'FTM'],
      ['ETH', 'FTM'],
      // ['BNB', 'FTM'],
    ],
  );
  await robot.Start();
}

main();
