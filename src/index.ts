import { Spot } from '@binance/connector';
import { Robot } from './robot';

async function main() {
  console.log('你好，世界');
  const client = new Spot();
  const robot = new Robot(client, 'USDT', ['BTC', 'ETH', 'LINK', 'ADA']);
  await robot.Start();
}

main();
