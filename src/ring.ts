import { Market } from './market';

export
class Ring {
  public constructor(
    private readonly ab_market: Market,
    private readonly ac_market: Market,
    private readonly bc_market: Market,
  ) { }

  public Check() {
    // ABCA成交机会检查
    const ab_ask_price = this.ab_market.ASKPriceEst;
    const ac_bid_price = this.ac_market.BIDPriceEst;
    const bc_ratio_price = ac_bid_price / ab_ask_price;
    // 卖C得B商价格
    const bc_ask_price = this.bc_market.ASKPriceEst;
    const bc_ask_price_ratio = (bc_ratio_price - bc_ask_price) / bc_ratio_price;
    if (bc_ask_price_ratio > 0.003) {
      // 发ABCA单
    }
  }
}

//       A
//    5     8
// B    1.6->  C
