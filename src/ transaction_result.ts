
export
abstract class TransactionResult {
  public constructor(
    private readonly in_asset: string,
    private readonly out_asset: string,
    protected readonly data: any,
  ) { }

  protected get fills_first() {
    return this.data.fills[0];
  }

  public get Price() {
    return Number(this.fills_first.price);
  }

  public get InAsset() {
    return this.in_asset;
  }

  abstract InQuantity: number;

  public get OutAsset() {
    return this.out_asset;
  }

  abstract OutQuantity: number;

  public Display() {
    console.log(`${this.InQuantity}:${this.InAsset} [${this.Price}]>> ${this.OutQuantity}:${this.OutAsset}`);
  }
}

export
class TransactionResultBuy
extends TransactionResult {
  public get InQuantity() {
    return Number(this.data.cummulativeQuoteQty);
  }

  public get OutQuantity() {
    if (this.fills_first.commissionAsset === this.OutAsset) {
      return Number(this.fills_first.qty) - Number(this.fills_first.commission);
    } else {
      return Number(this.fills_first.qty);
    }
  }
}

export
class TransactionResultSell
extends TransactionResult {
  public get InQuantity() {
    return Number(this.data.executedQty);
  }

  public get OutQuantity() {
    if (this.fills_first.commissionAsset === this.OutAsset) {
      return Number(this.data.cummulativeQuoteQty) - Number(this.fills_first.commission);
    } else {
      return Number(this.data.cummulativeQuoteQty);
    }
  }
}
