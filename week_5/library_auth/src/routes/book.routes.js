const express = require("express");
const bookController = require("../controllers/book.controller");
const validate = require("../middleware/validate");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");
const { createBookSchema, updateBookSchema } = require("../validators/book.validator");

const router = express.Router();

// Reading the catalogue stays public — no authenticate on these two.
router.get("/", bookController.listBooks);
router.get("/:id", bookController.getBook);

// Creating, updating, deleting is librarian-only.
router.post(
  "/",
  authenticate,
  authorize("librarian"),
  validate(createBookSchema),
  bookController.createBook
);
router.patch(
  "/:id",
  authenticate,
  authorize("librarian"),
  validate(updateBookSchema),
  bookController.updateBook
);
router.delete("/:id", authenticate, authorize("librarian"), bookController.deleteBook);

module.exports = router;
