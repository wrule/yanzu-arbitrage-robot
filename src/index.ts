import { Spot } from '@binance/connector';
import { Robot } from './robot';
import secret from './.secret.json';

async function main() {
  console.log('你好，世界');
  const client = new Spot(secret.API_KEY, secret.SECRET_KEY, { baseURL: 'https://api2.binance.com' });
  const robot = new Robot(
    client,
    'USDT',
    [['BTC', 'ETH'], ['BTC', 'ADA'], ['ETH', 'LINK']],
  );
  await robot.Start();
}

main();
