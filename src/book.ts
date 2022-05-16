
export
class Book {
  public constructor(
    private orders: [number, number][],
  ) { }

  public get BestOrder() {
    return this.orders[0];
  }

  public get BestPrice() {
    return this.orders[0][0];
  }

  public get BestVolume() {
    return this.orders[0][1];
  }

  public Update(orders: [number, number][]) {
    this.orders = orders;
  }
}
