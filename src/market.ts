import { pair_to_key } from './utils';
import fs from 'fs';
import axios, { AxiosResponse } from 'axios';

export
class Market {
  public constructor(
    private readonly client: any,
    public readonly data: any,
  ) {
    this.key = pair_to_key([this.baseAsset, this.quoteAsset]);
  }

  private key = '';

  public get Key() {
    return this.key;
  }

  public get symbol() {
    return this.data.symbol as string;
  }

  public get status() {
    return this.data.status as string;
  }

  public get baseAsset() {
    return this.data.baseAsset as string;
  }

  public get quoteAsset() {
    return this.data.quoteAsset as string;
  }

  public get BIDPriceEst() {
    return 0;
  }

  public get ASKPriceEst() {
    return 0;
  }

  public async Buy(quantity: number) {
    try {
      const rsp: AxiosResponse<any, any> = await this.client.newOrder(
        this.symbol,
        'BUY',
        'MARKET',
        {
          quantity,
          // timeInForce: 'GTC',
        },
      );
      if (rsp.status === 200) {
        fs.writeFileSync('buy.json', JSON.stringify(rsp.data, null, 2));
      }
    } catch (e) {
      console.error(e);
    }
  }

  public async Sell(quantity: number) {
    try {
      const rsp = await this.client.newOrder(
        this.symbol,
        'SELL',
        'MARKET',
        {
          quantity,
          // timeInForce: 'GTC',
        },
      );
      console.log(rsp);
    } catch (e) {
      console.error(e);
    }
  }
}
