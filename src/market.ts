import { pair_to_key } from './utils';
import fs from 'fs';
import axios, { AxiosResponse } from 'axios';
import { TransactionResultBuy, TransactionResultSell } from './ transaction_result';

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

  public get filters() {
    return this.data.filters as any[];
  }

  public get stepSize() {
    const lot_size_item = this.filters.find((item) => item.filterType === 'LOT_SIZE');
    return Number(lot_size_item?.stepSize);
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

  public async Buy(in_qty: number) {
    const rsp: AxiosResponse<any, any> = await this.client.newOrder(
      this.symbol,
      'BUY',
      'MARKET',
      { quoteOrderQty: in_qty, },
    );
    fs.writeFileSync('buy.json', JSON.stringify(rsp.data, null, 2));
    return new TransactionResultBuy(this.quoteAsset, this.baseAsset, rsp.data);
  }

  public async Sell(in_qty: number) {
    const rsp: AxiosResponse<any, any> = await this.client.newOrder(
      this.symbol,
      'SELL',
      'MARKET',
      { quantity: in_qty, },
    );
    fs.writeFileSync('sell.json', JSON.stringify(rsp.data, null, 2));
    return new TransactionResultSell(this.baseAsset, this.quoteAsset, rsp.data);
  }
}
