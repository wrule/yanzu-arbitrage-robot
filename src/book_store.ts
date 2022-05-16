import { Book, Order } from './book';

export
type BookMap = Map<string, Book>;

export
class BookStore {
  public constructor() { }

  private store = new Map<string, BookMap>();

  private searchChance() {
    Array.from(this.store.entries()).forEach(([src_code, book_map]) => {
      Array.from(book_map.entries()).forEach(([dst_code, book]) => {

      });
    });
  }

  public Update(
    code: [string, string],
    orders: Order[],
    book_time = -1,
  ) {
    if (!this.store.has(code[0])) {
      this.store.set(code[0], new Map<string, Book>([
        [code[1], new Book(orders, book_time)],
      ]));
    } else {
      const book_map = this.store.get(code[0]);
      if (!book_map?.has(code[1])) {
        book_map?.set(code[1], new Book(orders, book_time));
      } else {
        const book = book_map?.get(code[1]);
        book?.Update(orders, book_time);
      }
    }
  }
}
