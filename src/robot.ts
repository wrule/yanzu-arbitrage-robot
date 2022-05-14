
export
class Robot {
  public constructor(
    private readonly base: string,
    private readonly coins: string[],
  ) {
    this.pairs = this.allPairs();
    console.log(this.pairs);
  }

  private allPairs() {
    const result: string[] = [];
    const all_coins = Array.from(new Set(this.coins.concat(this.base)));
    for (let i = 0; i < all_coins.length - 1; ++i) {
      for (let j = i + 1; j < all_coins.length; ++j) {
        result.push(`${all_coins[i]}/${all_coins[j]}`.toUpperCase());
        result.push(`${all_coins[j]}/${all_coins[i]}`.toUpperCase());
      }
    }
    return result;
  }

  private pairs: string[] = [];

  public Start() {

  }

  public Stop() {

  }
}
