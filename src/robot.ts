export
class Robot {
  public constructor(
    private readonly client: any,
    private readonly base: string,
    private readonly coins: string[],
  ) { }

  public async Start() {
    console.log('开始');
  }
}
