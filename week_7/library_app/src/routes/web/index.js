const express = require("express");
const bookWeb = require("../../controllers/web/book.web.controller");
const authWeb = require("../../controllers/web/auth.web.controller");
const { requireLogin, requireLibrarian, requireCsrf } = require("../../middleware/web-auth");

const router = express.Router();

// Catalogue and detail pages are public.
router.get("/", bookWeb.showCatalogue);
router.get("/books/:id", bookWeb.showBook);

// Librarian-only pages.
router.get("/books/new", requireLibrarian, bookWeb.showNewForm);
router.post("/books", requireLibrarian, requireCsrf, bookWeb.createBook);
router.get("/books/:id/edit", requireLibrarian, bookWeb.showEditForm);
router.post("/books/:id", requireLibrarian, requireCsrf, bookWeb.updateBook);
router.post("/books/:id/delete", requireLibrarian, requireCsrf, bookWeb.deleteBook);

// Auth pages — anyone.
router.get("/login", authWeb.showLogin);
router.post("/login", authWeb.login);
router.get("/register", authWeb.showRegister);
router.post("/register", authWeb.register);
router.post("/logout", authWeb.logout);

module.exports = router;
