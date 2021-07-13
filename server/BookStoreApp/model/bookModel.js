let books = [];
let count = 0;

class Book {
  constructor(id, title, author, isbn, price, description) {
    this._id = id;
    this.title = title;
    this.author = author;
    this.isbn = isbn;
    this.price = price;
    this.description = description;
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

let bookEg = new Book(
  null,
  "mylife and walk",
  "mintes",
  "232165464",
  "20",
  "self Development"
);
let bookEg2 = new Book(
  null,
  "walk with him",
  "Robs",
  "65465865464",
  "50",
  "Spiritual"
);

bookEg.save();
bookEg2.save();
module.exports = Book;
