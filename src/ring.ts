import { Market } from './market';
import { TransactionResult } from './ transaction_result';

export
class Ring {
  public constructor(
    private readonly base_market1: Market,
    private readonly base_market2: Market,
    private readonly swap_market: Market,
  ) { }

  private base_market1_forward = true;
  private base_market2_forward = true;
  private swap_market_forward = true;

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
