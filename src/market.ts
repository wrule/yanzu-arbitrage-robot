import fs from 'fs';
import { AxiosResponse } from 'axios';
import { pair_to_key } from './utils';
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

  /**
   * 购买
   * @param in_qty 输入资产数量
   * @returns 交易结果
   */
  public async Buy(in_qty: number) {
    const rsp: AxiosResponse<any, any> = await this.client.newOrder(
      this.symbol,
      'BUY',
      'MARKET',
      { quoteOrderQty: in_qty, },
    );
    return new TransactionResultBuy(this.quoteAsset, this.baseAsset, rsp.data);
  }

  public async Sell(in_qty: number) {
    const multiplier = Math.ceil(1 / this.stepSize);
    const real_in_qty = Math.floor(in_qty * multiplier) / multiplier;
    const rsp: AxiosResponse<any, any> = await this.client.newOrder(
      this.symbol,
      'SELL',
      'MARKET',
      { quantity: real_in_qty, },
    );
    return new TransactionResultSell(this.baseAsset, this.quoteAsset, rsp.data);
  }
}
