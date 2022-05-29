import { AxiosResponse } from 'axios';
import { TransactionResultBuy, TransactionResultSell } from './transaction_result';

export
type Book = [number, number][];

export
class Market {
  public constructor(
    private readonly client: any,
    public readonly data: any,
  ) { }

  private sell_book: Book = [];
  private buy_book: Book = [];

  public get Ready() {
    return this.buy_book.length > 0 && this.sell_book.length > 0;
  }

  //#region 原始数据包装属性
  public get symbol() {
    return this.data.symbol as string;
  }

  public get status() {
    return this.data.status as string;
  }

  public get filters() {
    return this.data.filters as any[];
  }

  public get stepSize() {
    const lot_size_item = this.filters.find((item) => item.filterType === 'LOT_SIZE');
    return Number(lot_size_item?.stepSize);
  }

  public get baseAsset() {
    return this.data.baseAsset as string;
  }

  public get quoteAsset() {
    return this.data.quoteAsset as string;
  }
  //#endregion

  public get SellBook() {
    return this.sell_book;
  }

  public get SellPriceEst() {
    return Number(this.sell_book[0][0]);
  }

  public get BuyBook() {
    return this.buy_book;
  }

  public get BuyPriceEst() {
    return Number(this.buy_book[0][0]);
  }

  /**
   * 更新订单薄
   * @param sell_book 出售订单薄
   * @param buy_book 购买订单薄
   */
  public UpdateBook(sell_book: Book, buy_book: Book) {
    this.sell_book = sell_book;
    this.buy_book = buy_book;
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

  /**
   * 出售
   * @param in_qty 输入资产数量
   * @returns 交易结果
   */
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

  public Dump() {
    return {
      symbol: this.symbol,
      status: this.status,
      step_size: this.stepSize,
      base_asset: this.baseAsset,
      quote_asset: this.quoteAsset,
      sell_book: this.sell_book,
      sell_price_est: this.SellPriceEst,
      buy_book: this.buy_book,
      buy_price_est: this.BuyPriceEst,
    };
  }
}
