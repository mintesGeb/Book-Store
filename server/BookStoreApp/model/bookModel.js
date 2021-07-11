let books = [];
let count = 0;

class Book {
  constructor(id, title, author, isbn) {
    this._id = id;
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
  static fetchAll() {
    return books;
  }
  static fetchById(productID) {
    let found = books.find((book) => book._id == productID);
    if (found) {
      return found;
    }
  }
  save() {
    this._id = count;
    books.push(this);
    count++;
    return this;
  }
  static delete(productID) {
    let index = books.findIndex((book) => book._id == productID);
    if (index > -1) {
      books = books.filter((book) => book._id != productID);
      return books;
    } else {
      throw Error("Not Found");
    }
  }
  update(productID) {
    const index = books.findIndex((book) => book._id == productID);
    if (index !== -1) {
      books.splice(index, 1, this);

      return this;
    } else {
      throw Error("Not Found");
    }
  }
}
module.exports = Book;
