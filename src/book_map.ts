import { Book } from "./book";

export
class BookMap {
  public constructor() { }

  private bookMap = new Map<string, [string, Book]>();

  public Update(symbol: string, book: Book) {

  }
}
