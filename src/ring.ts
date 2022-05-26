import { Market } from './market';
import { TransactionResult } from './ transaction_result';

export
class Ring {
  public constructor(
    private readonly base_market1: Market,
    private readonly base_market2: Market,
    private readonly swap_market: Market,
  ) { }

  private base_name = '';
  private swap1_name = '';
  private swap2_name = '';

  private async base_to_swap1(in_qty: number): Promise<TransactionResult> {
    return null as any;
  }

  private async swap1_to_base(in_qty: number): Promise<TransactionResult> {
    return null as any;
  }

  private async base_to_swap2(in_qty: number): Promise<TransactionResult> {
    return null as any;
  }

  private async swap2_to_base(in_qty: number): Promise<TransactionResult> {
    return null as any;
  }

  private async swap1_to_swap2(in_qty: number): Promise<TransactionResult> {
    return null as any;
  }

  private async swap2_to_swap1(in_qty: number): Promise<TransactionResult> {
    return null as any;
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
