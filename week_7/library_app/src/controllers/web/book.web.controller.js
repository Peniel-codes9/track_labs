// Renders pages and redirects. Never queries the database directly — every
// piece of data comes from the same service the JSON API uses.
const bookService = require("../../services/book.service");


async function showCatalogue(req, res, next) {
  try {
    const result = await bookService.listBooks(req.query);
    res.render("pages/books/index", {
      books: result.books,
      page: result.page,
      totalPages: result.totalPages,
      query: req.query,
      genres: bookService.getGenres(),
    });
  } catch (err) {
    next(err);
  }
}

async function showBook(req, res, next) {
  try {
    const book = await bookService.getBookById(req.params.id);
    res.render("pages/books/show", { book: book });
  } catch (err) {
    next(err);
  }
}

function showNewForm(req, res) {
  res.render("pages/books/new", {
    book: {},
    errors: null,
    genres: bookService.getGenres(),
  });
}

async function createBook(req, res, next) {
  try {
    const book = await bookService.createBook(req.body);
    req.session.flash = { type: "success", text: 'Book "' + book.title + '" created.' };
    res.redirect("/books/" + book._id);
  } catch (err) {
    // Validation failure -> re-render the SAME form with the values the
    // user already typed, instead of redirecting and losing their input.
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).render("pages/books/new", {
        book: req.body,
        errors: messages,
        genres: bookService.getGenres(),
      });
    }
    next(err);
  }
}

async function showEditForm(req, res, next) {
  try {
    const book = await bookService.getBookById(req.params.id);
    res.render("pages/books/edit", { book: book, errors: null, genres: bookService.getGenres() });
  } catch (err) {
    next(err);
  }
}

async function updateBook(req, res, next) {
  try {
    const book = await bookService.updateBook(req.params.id, req.body);
    req.session.flash = { type: "success", text: 'Book "' + book.title + '" updated.' };
    res.redirect("/books/" + book._id);
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).render("pages/books/edit", {
        book: Object.assign({ _id: req.params.id }, req.body),
        errors: messages,
        genres: bookService.getGenres(),
      });
    }
    next(err);
  }
}

async function deleteBook(req, res, next) {
  try {
    await bookService.deleteBook(req.params.id);
    req.session.flash = { type: "success", text: "Book deleted." };
    res.redirect("/");
  } catch (err) {
    next(err);
  }
}

module.exports = { showCatalogue, showBook, showNewForm, createBook, showEditForm, updateBook, deleteBook };
