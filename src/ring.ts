import { Market } from './market';
import { TransactionResult } from './transaction_result';
import fs from 'fs';
import moment from 'moment';

/**
 * 交易环
 */
export
class Ring {
  public constructor(
    private readonly base_market1: Market,
    private readonly base_market2: Market,
    private readonly swap_market: Market,
    private readonly fee = 0.999,
  ) {
    this.initialization();
  }

  private snapshot_base_market1!: Market;
  private snapshot_base_market2!: Market;
  private snapshot_swap_market!: Market;

  private base = '';
  private swap1 = '';
  private swap2 = '';
  private base_market1_forward = true;
  private base_market2_forward = true;
  private swap_market_forward = true;

  public get symbol() {
    return `${this.base}:${this.swap1}<->${this.swap2}`;
  }

  /**
   * 初始化与校验
   */
  private initialization() {
    if (
      (this.base_market1.quoteAsset === this.base_market2.quoteAsset) ||
      (this.base_market1.quoteAsset === this.base_market2.baseAsset)
    ) {
      this.base = this.base_market1.quoteAsset;
    }
    if (
      (this.base_market1.baseAsset === this.base_market2.quoteAsset) ||
      (this.base_market1.baseAsset === this.base_market2.baseAsset)
    ) {
      this.base = this.base_market1.baseAsset;
    }
    if (!this.base) {
      throw new Error('无法定位到base');
    }

    if (this.base_market1.quoteAsset === this.base) {
      this.base_market1_forward = true;
      this.swap1 = this.base_market1.baseAsset;
    } else {
      this.base_market1_forward = false;
      this.swap1 = this.base_market1.quoteAsset;
    }

    if (this.base_market2.quoteAsset === this.base) {
      this.base_market2_forward = true;
      this.swap2 = this.base_market2.baseAsset;
    } else {
      this.base_market2_forward = false;
      this.swap2 = this.base_market2.quoteAsset;
    }

    if (
      (this.swap_market.baseAsset === this.swap1) &&
      (this.swap_market.quoteAsset === this.swap2)
    ) {
      this.swap_market_forward = true;
    } else if (
      (this.swap_market.baseAsset === this.swap2) &&
      (this.swap_market.quoteAsset === this.swap1)
    ) {
      this.swap_market_forward = false;
    } else {
      throw new Error('swap市场没有对齐');
    }
  }

  //#region 真实交易方法
  private async base_to_swap1(in_qty: number): Promise<TransactionResult> {
    if (this.base_market1_forward) {
      return this.base_market1.Buy(in_qty);
    } else {
      return this.base_market1.Sell(in_qty);
    }
  }

  private async swap1_to_base(in_qty: number): Promise<TransactionResult> {
    if (this.base_market1_forward) {
      return this.base_market1.Sell(in_qty);
    } else {
      return this.base_market1.Buy(in_qty);
    }
  }

  private async base_to_swap2(in_qty: number): Promise<TransactionResult> {
    if (this.base_market2_forward) {
      return this.base_market2.Buy(in_qty);
    } else {
      return this.base_market2.Sell(in_qty);
    }
  }

  private async swap2_to_base(in_qty: number): Promise<TransactionResult> {
    if (this.base_market2_forward) {
      return this.base_market2.Sell(in_qty);
    } else {
      return this.base_market2.Buy(in_qty);
    }
  }

  private async swap1_to_swap2(in_qty: number): Promise<TransactionResult> {
    if (this.swap_market_forward) {
      return this.swap_market.Sell(in_qty);
    } else {
      return this.swap_market.Buy(in_qty);
    }
  }

  private async swap2_to_swap1(in_qty: number): Promise<TransactionResult> {
    if (this.swap_market_forward) {
      return this.swap_market.Buy(in_qty);
    } else {
      return this.swap_market.Sell(in_qty);
    }
  }

  public async forward_transaction(in_qty: number) {
    const tn1 = await this.base_to_swap1(in_qty);
    const tn2 = await this.swap1_to_swap2(tn1.OutQuantity);
    const tn3 = await this.swap2_to_base(tn2.OutQuantity);
    return [tn1, tn2, tn3];
  }

  public async reverse_transaction(in_qty: number) {
    const tn1 = await this.base_to_swap2(in_qty);
    const tn2 = await this.swap2_to_swap1(tn1.OutQuantity);
    const tn3 = await this.swap1_to_base(tn2.OutQuantity);
    return [tn1, tn2, tn3];
  }
  //#endregion

  //#region 模拟交易方法
  private sim_base_to_swap1(in_qty: number): number {
    let out_qty = 0;
    if (this.base_market1_forward) {
      out_qty = in_qty / this.base_market1.SellPriceEst;
    } else {
      out_qty = in_qty * this.base_market1.BuyPriceEst;
    }
    return out_qty * this.fee;
  }

  private sim_swap1_to_base(in_qty: number): number {
    let out_qty = 0;
    if (this.base_market1_forward) {
      out_qty = in_qty * this.base_market1.BuyPriceEst;
    } else {
      out_qty = in_qty / this.base_market1.SellPriceEst;
    }
    return out_qty * this.fee;
  }

  private sim_base_to_swap2(in_qty: number): number {
    let out_qty = 0;
    if (this.base_market2_forward) {
      out_qty = in_qty / this.base_market2.SellPriceEst;
    } else {
      out_qty = in_qty * this.base_market2.BuyPriceEst;
    }
    return out_qty * this.fee;
  }

  private sim_swap2_to_base(in_qty: number): number {
    let out_qty = 0;
    if (this.base_market2_forward) {
      out_qty = in_qty * this.base_market2.BuyPriceEst;
    } else {
      out_qty = in_qty / this.base_market2.SellPriceEst;
    }
    return out_qty * this.fee;
  }

  private sim_swap1_to_swap2(in_qty: number): number {
    let out_qty = 0;
    if (this.swap_market_forward) {
      out_qty = in_qty * this.swap_market.BuyPriceEst;
    } else {
      out_qty = in_qty / this.swap_market.SellPriceEst;
    }
    return out_qty * this.fee;
  }

  private sim_swap2_to_swap1(in_qty: number): number {
    let out_qty = 0;
    if (this.swap_market_forward) {
      out_qty = in_qty / this.swap_market.SellPriceEst;
    } else {
      out_qty = in_qty * this.swap_market.BuyPriceEst;
    }
    return out_qty * this.fee;
  }

  private sim_forward_transaction(in_qty: number): number {
    const out1 = this.sim_base_to_swap1(in_qty);
    const out2 = this.sim_swap1_to_swap2(out1);
    return this.sim_swap2_to_base(out2);
  }

  private sim_reverse_transaction(in_qty: number): number {
    const out1 = this.sim_base_to_swap2(in_qty);
    const out2 = this.sim_swap2_to_swap1(out1);
    return this.sim_swap1_to_base(out2);
  }
  //#endregion

  public get BaseMarket1() {
    return this.base_market1;
  }

  public get BaseMarket2() {
    return this.base_market2;
  }

  public get SwapMarket() {
    return this.swap_market;
  }

  public get MarketSymbols() {
    return [
      this.base_market1.symbol,
      this.base_market2.symbol,
      this.swap_market.symbol,
    ];
  }

  private is_trading = false;

  private get forward_diff_ratio() {
    const in_qty = 100;
    const forward_out_qty = this.sim_forward_transaction(in_qty);
    const forward_diff_ratio = (forward_out_qty - in_qty) / in_qty;
    return forward_diff_ratio;
  }

  private get reverse_diff_ratio() {
    const in_qty = 100;
    const reverse_out_qty = this.sim_reverse_transaction(in_qty);
    const reverse_diff_ratio = (reverse_out_qty - in_qty) / in_qty;
    return reverse_diff_ratio;
  }

  private result_list: TransactionResult[] = [];

  public async Check() {
    if (
      this.base_market1.Ready &&
      this.base_market2.Ready &&
      this.swap_market.Ready &&
      !this.is_trading
    ) {
      try {
        // 还是需要加锁
        // 应该独立出一个有日志可回滚的交易模块
        if (this.forward_diff_ratio > 0) {
          console.log('正向交易机会');
          console.log('Find: ', this.symbol, this.forward_diff_ratio);
          this.is_trading = true;
          const dump_object = this.Dump();
          // (async () => {
            this.result_list = await this.forward_transaction(20);
            this.is_trading = false;
            dump_object.result_list = this.result_list.map((result) => result.Dump());
            fs.appendFileSync(
              'tns.json',
              `${JSON.stringify(dump_object, null, 2)},\n`
            );
          // })();
        }

        if (this.reverse_diff_ratio > 0) {
          console.log('反向交易机会');
          console.log('Find: ', this.symbol, this.reverse_diff_ratio);
          this.is_trading = true;
          const dump_object = this.Dump();
          // (async () => {
            this.result_list = await this.reverse_transaction(20);
            this.is_trading = false;
            dump_object.result_list = this.result_list.map((result) => result.Dump());
            fs.appendFileSync(
              'tns.json',
              `${JSON.stringify(dump_object, null, 2)},\n`
            );
          // })();
        }

        if (Math.random() * 50000 < 1) {
          console.log('Check: ', this.symbol, this.forward_diff_ratio, this.reverse_diff_ratio);
        }
      } catch (e) {
        console.error(e);
        fs.appendFileSync(
          'tne.json',
          `${moment().format('YYYY-MM-DD HH:mm:ss')}\n${e}\n${JSON.stringify(this.Dump(), null, 2)},\n`
        );
      }
    }
  }

  public Dump() {
    return {
      symbol: this.symbol,
      base: this.base,
      swap1: this.swap1,
      swap2: this.swap2,
      fee: this.fee,
      forward_diff_ratio: this.forward_diff_ratio,
      reverse_diff_ratio: this.reverse_diff_ratio,
      base_market1: this.base_market1.Dump(),
      base_market2: this.base_market2.Dump(),
      swap_market: this.swap_market.Dump(),
      result_list: this.result_list.map((result) => result.Dump()),
    };
  }
}
