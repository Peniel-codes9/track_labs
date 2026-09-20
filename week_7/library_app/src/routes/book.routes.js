const express = require("express");
const bookController = require("../controllers/book.controller");
const validate = require("../middleware/validate");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");
const csrfProtection = require("../middleware/csrf");
const { createBookSchema, updateBookSchema } = require("../validators/book.validator");

const router = express.Router();

router.get("/", bookController.listBooks);
router.get("/:id", bookController.getBook);

// authenticate -> csrf -> authorize -> validate -> controller.
// csrf runs right after authenticate: it's checking that THIS session
// intentionally made THIS request, before we even ask whether the role is
// allowed to do it.
router.post(
  "/",
  authenticate,
  csrfProtection,
  authorize("librarian"),
  validate(createBookSchema),
  bookController.createBook
);
router.patch(
  "/:id",
  authenticate,
  csrfProtection,
  authorize("librarian"),
  validate(updateBookSchema),
  bookController.updateBook
);
router.delete(
  "/:id",
  authenticate,
  csrfProtection,
  authorize("librarian"),
  bookController.deleteBook
);

module.exports = router;
