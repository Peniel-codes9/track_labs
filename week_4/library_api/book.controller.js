const mongoose = require("mongoose");
const Book = require("../models/book.model");

function isValidId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

async function createBook(req, res, next) {
  try {
    const book = await Book.create(req.body);
    res.status(201).location("/api/books/" + book._id).json(book);
  } catch (err) {
    next(err);
  }
}

async function listBooks(req, res, next) {
  try {
    const genre = req.query.genre;

    if (genre && !Book.GENRES.includes(genre)) {
      return res.status(400).json({
        error: { message: "genre must be one of: " + Book.GENRES.join(", ") },
      });
    }

    const filter = {};
    if (req.query.author) filter.author = req.query.author;
    if (genre) filter.genre = genre;

    const books = await Book.find(filter);
    res.status(200).json(books);
  } catch (err) {
    next(err);
  }
}

async function getBook(req, res, next) {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ error: { message: "Invalid book id" } });
    }

    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ error: { message: "Book not found" } });
    }

    res.status(200).json(book);
  } catch (err) {
    next(err);
  }
}

async function updateBook(req, res, next) {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ error: { message: "Invalid book id" } });
    }

    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!book) {
      return res.status(404).json({ error: { message: "Book not found" } });
    }

    res.status(200).json(book);
  } catch (err) {
    next(err);
  }
}

async function deleteBook(req, res, next) {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ error: { message: "Invalid book id" } });
    }

    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).json({ error: { message: "Book not found" } });
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { createBook, listBooks, getBook, updateBook, deleteBook };