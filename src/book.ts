
export
class Book {
  public constructor(
    private bid: [number, number][] = [],
    private ask: [number, number][] = [],
  ) { }

  public get BID() {
    return this.bid;
  }

  public get BIDBest() {
    return this.bid[0];
  }

  public get BIDBestPrice() {
    return this.bid[0][0];
  }

  public get BIDBestVolume() {
    return this.bid[0][1];
  }

  public get ASK() {
    return this.ask;
  }

  public get ASKBest() {
    return this.ask[0];
  }

  public get ASKBestPrice() {
    return this.ask[0][0];
  }

  public get ASKBestVolume() {
    return this.ask[0][1];
  }

  public Update(
    bid: [number, number][],
    ask: [number, number][],
  ) {
    this.bid = bid;
    this.ask = ask;
  }
}
