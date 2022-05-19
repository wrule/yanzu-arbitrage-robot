
export
abstract class TransactionResult {
  public constructor(
    private readonly in_asset: string,
    private readonly out_asset: string,
    private readonly data: any,
  ) { }

  public get InAsset() {
    return this.in_asset;
  }

  abstract InQuantity: string;

  public get OutAsset() {
    return this.out_asset;
  }

  abstract OutQuantity: string;
}
