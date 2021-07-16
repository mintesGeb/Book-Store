const Book = require("../model/bookModel");

const save = (req, res, next) => {
  const newBook = new Book(
    null,
    req.body.title,
    req.body.author,
    req.body.isbn,
    req.body.price,
    req.body.description
  );
  res.json({ result: newBook.save() });
};
const getAllBooks = (req, res, next) => {
  res.json({ result: Book.fetchAll() });
};

const getProductById = (req, res, next) => {
  res.json({ result: Book.fetchById(req.params.id) });
};
const deleteProductByID = (req, res, next) => {
  res.json({ result: Book.delete(req.params.id) });
};
const updateProductByID = (req, res, next) => {
  const bookUpdate = new Book(
    req.params.id,
    req.body.title,
    req.body.author,
    req.body.isbn,
    req.body.price,
    req.body.description
  );
  res.json({ result: bookUpdate.update(req.params.id) });
};

module.exports = {
  save,
  getAllBooks,
  getProductById,
  deleteProductByID,
  updateProductByID,
};
