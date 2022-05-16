
export
type Order = [number, number];

export
class Book {
  public constructor(
    private orders: Order[],
    private book_time = -1,
    private update_time = Number(new Date()),
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

  public get BookTime() {
    return this.book_time;
  }

  public get UpdateTime() {
    return this.update_time;
  }

  public Update(orders: Order[], book_time = -1) {
    this.orders = orders;
    this.book_time = book_time;
    this.update_time = Number(new Date());
  }
}
