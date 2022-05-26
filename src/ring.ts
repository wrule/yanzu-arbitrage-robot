import { Market } from './market';
import { TransactionResult } from './ transaction_result';

export
class Ring {
  public constructor(
    private readonly base_market1: Market,
    private readonly base_market2: Market,
    private readonly swap_market: Market,
  ) {
    this.initialization();
  }

  private base = '';
  private swap1 = '';
  private swap2 = '';
  private base_market1_forward = true;
  private base_market2_forward = true;
  private swap_market_forward = true;

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

  private async forward_transaction(in_qty: number) {
    const tn1 = await this.base_to_swap1(in_qty);
    const tn2 = await this.swap1_to_swap2(tn1.OutQuantity);
    const tn3 = await this.swap2_to_base(tn2.OutQuantity);
  }

  private async reverse_transaction(in_qty: number) {
    const tn1 = await this.base_to_swap2(in_qty);
    const tn2 = await this.swap2_to_swap1(tn1.OutQuantity);
    const tn3 = await this.swap1_to_base(tn2.OutQuantity);
  }
  //#endregion

  //#region 模拟交易方法
  private sim_base_to_swap1(in_qty: number): number {
    let out_qty = 0;
    if (this.base_market1_forward) {
      // BTC/USDT 10
      out_qty = in_qty / this.base_market1.SellPriceEst;
    } else {
      // USDT/BTC 0.1
      out_qty = in_qty * this.base_market1.BuyPriceEst;
    }
    return out_qty * 0.999;
  }

  private sim_swap1_to_base(in_qty: number): number {
    let out_qty = 0;
    if (this.base_market1_forward) {
      // BTC/USDT 10
      out_qty = in_qty * this.base_market1.BuyPriceEst;
    } else {
      // USDT/BTC 0.1
      out_qty = in_qty / this.base_market1.SellPriceEst;
    }
    return out_qty * 0.999;
  }

  private sim_base_to_swap2(in_qty: number): number {
    let out_qty = 0;
    if (this.base_market2_forward) {
      out_qty = in_qty / this.base_market2.SellPriceEst;
    } else {
      out_qty = in_qty * this.base_market2.BuyPriceEst;
    }
    return out_qty * 0.999;
  }

  private sim_swap2_to_base(in_qty: number): number {
    let out_qty = 0;
    if (this.base_market2_forward) {
      out_qty = in_qty * this.base_market2.BuyPriceEst;
    } else {
      out_qty = in_qty / this.base_market2.SellPriceEst;
    }
    return out_qty * 0.999;
  }

  private sim_swap1_to_swap2(in_qty: number): number {
    let out_qty = 0;
    if (this.swap_market_forward) {
      // BTC/USDT 10
      out_qty = in_qty * this.swap_market.BuyPriceEst;
    } else {
      // USDT/BTC 0.1
      out_qty = in_qty / this.swap_market.SellPriceEst;
    }
    return out_qty * 0.999;
  }

  private sim_swap2_to_swap1(in_qty: number): number {
    let out_qty = 0;
    if (this.swap_market_forward) {
      // BTC/USDT 10
      out_qty = in_qty / this.swap_market.SellPriceEst;
    } else {
      // USDT/BTC 0.1
      out_qty = in_qty * this.swap_market.BuyPriceEst;
    }
    return out_qty * 0.999;
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

  public Check() {
    // 思考如何计算套利空间
    console.log(
      this.base_market1.symbol,
      this.base_market1.SellPriceEst,
      this.base_market1.BuyPriceEst,
      this.base_market2.symbol,
      this.swap_market.symbol,
    );
  }
}


//           USDT
//        10      6
//      *           *
//   BTC     0.5*     ETH

// 100 / 10 / 0.5 * 6 = 120
