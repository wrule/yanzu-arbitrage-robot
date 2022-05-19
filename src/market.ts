import { pair_to_key } from './utils';

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
      const rsp = await this.client.newOrder(
        this.symbol,
        'BUY',
        'MARKET',
        {
          quantity,
          timeInForce: 'GTC',
        },
      );
      console.log(rsp);
    } catch (e) {
      console.log('买入错误');
    }
  }

  public async Sell() {

  }
}
