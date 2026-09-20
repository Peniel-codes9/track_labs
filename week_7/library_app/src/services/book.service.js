// Every book database query lives here. Both the JSON API controllers and
// the web (page-rendering) controllers call these same functions — nobody
// else is allowed to import the Book model directly.
const Book = require("../models/book.model");

async function listBooks(filters) {
  const genre = filters.genre;
  const author = filters.author;
  const search = filters.search;

  if (genre && !Book.GENRES.includes(genre)) {
    const err = new Error("genre must be one of: " + Book.GENRES.join(", "));
    err.status = 400;
    throw err;
  }

  const query = {};
  if (author) query.author = author;
  if (genre) query.genre = genre;
  if (search) {
    // Simple case-insensitive partial match on title or author, used by
    // the catalogue page's search box (and available to the API too).
    const pattern = new RegExp(search, "i");
    query.$or = [{ title: pattern }, { author: pattern }];
  }

  const page = Math.max(1, Number(filters.page) || 1);
  const limit = Math.min(50, Number(filters.limit) || 12);
  const skip = (page - 1) * limit;

  const [books, total] = await Promise.all([
    Book.find(query).skip(skip).limit(limit),
    Book.countDocuments(query),
  ]);

  return {
    books: books,
    page: page,
    limit: limit,
    total: total,
    totalPages: Math.ceil(total / limit) || 1,
  };
}

function isValidId(id) {
  const mongoose = require("mongoose");
  return mongoose.Types.ObjectId.isValid(id);
}

async function getBookById(id) {
  if (!isValidId(id)) {
    const err = new Error("Invalid book id");
    err.status = 400;
    throw err;
  }

  const book = await Book.findById(id);
  if (!book) {
    const err = new Error("Book not found");
    err.status = 404;
    throw err;
  }

  return book;
}

async function createBook(data) {
  return Book.create(data);
}

async function updateBook(id, data) {
  if (!isValidId(id)) {
    const err = new Error("Invalid book id");
    err.status = 400;
    throw err;
  }

  const book = await Book.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

  if (!book) {
    const err = new Error("Book not found");
    err.status = 404;
    throw err;
  }

  return book;
}

async function deleteBook(id) {
  if (!isValidId(id)) {
    const err = new Error("Invalid book id");
    err.status = 400;
    throw err;
  }

  const book = await Book.findByIdAndDelete(id);
  if (!book) {
    const err = new Error("Book not found");
    err.status = 404;
    throw err;
  }

  return book;
}

function getGenres() {
  return Book.GENRES;
}

module.exports = { listBooks, getBookById, createBook, updateBook, deleteBook, isValidId, getGenres };
