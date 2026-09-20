// Thin on purpose: read from req, call the service, pick a status code.
// No Mongoose import here at all — that's the point of this lab's refactor.
const bookService = require("../services/book.service");

async function createBook(req, res, next) {
  try {
    const book = await bookService.createBook(req.body);
    res.status(201).location("/api/books/" + book._id).json(book);
  } catch (err) {
    next(err);
  }
}

async function listBooks(req, res, next) {
  try {
    const result = await bookService.listBooks(req.query);
    res.status(200).json(result.books);
  } catch (err) {
    next(err);
  }
}

async function getBook(req, res, next) {
  try {
    const book = await bookService.getBookById(req.params.id);
    res.status(200).json(book);
  } catch (err) {
    next(err);
  }
}

async function updateBook(req, res, next) {
  try {
    const book = await bookService.updateBook(req.params.id, req.body);
    res.status(200).json(book);
  } catch (err) {
    next(err);
  }
}

async function deleteBook(req, res, next) {
  try {
    await bookService.deleteBook(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { createBook, listBooks, getBook, updateBook, deleteBook };
